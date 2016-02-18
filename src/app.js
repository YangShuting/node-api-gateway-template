require("babel-core/register");
require("babel-polyfill");

// app arguments
import minimist from 'minimist';
const args = minimist(process.argv.slice(2));

// logger
import winston from 'winston';
const logger = winston;
logger.info('set log level to ' + args.logLevel);
logger.level = args.logLevel || 'info'; // set log level
logger.info('setted log level to ' + logger.level);

import express from 'express';
const app = express();
import * as falcorExpress from 'falcor-express';
import Router from 'falcor-router';
import jwt from 'express-jwt';
import config from './config.json';

var debug = require('debug')('app:' + process.pid),
    path = require("path"),
    onFinished = require('on-finished'),
    NotFoundError = require(path.join(__dirname, "errors", "NotFoundError.js")),
    utils = require(path.join(__dirname, "utils.js")),
    unless = require('express-unless');

app.use(require('morgan')("dev")); // log server
var bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(require('compression')());
app.use(require('response-time')());

var port = function () {
    var portGlobal = process.env.PORT;
    logger.info("portGlobal = " + portGlobal);

    var port = portGlobal /*|| portParameter*/ || '9090';
    logger.info("port = " + port);

    return port;
};

const publicDataSourceRouter = function (req, res) {
    // create a Virtual JSON resource with single key ("greeting")
    return new Router([
        {
            // match a request for the key "greeting"
            route: "greeting",
            // respond with a PathValue with the value of "Hello World."
            get: function () {
                return {path: ["greeting"], value: "Hello world"};
            }
        }
    ]);
};

const privateDataSourceRouter = function (req, res) {
    // create a Virtual JSON resource with single key ("greeting")
    return new Router([
        {
            // match a request for the key "greeting"
            route: "login",
            // respond with a PathValue with the value of "Hello World."
            get: function () {
                return {path: ["login"], value: "Private Hello World"};
            }
        }
    ]);
};

app.use(function (req, res, next) {

    onFinished(res, function (err) {
        debug("[%s] finished request", req.connection.remoteAddress);
    });

    next();
});

var jwtCheck = jwt({
    secret: config.secret
});
jwtCheck.unless = unless;

const publicPath = {
    path: [
        '/',
        '/index.html', // just for this demo
        '^/static/',
        '^/api/public/'
    ]
};

/*
 TODO
 /api/public/...
 /api/private/...
 /api/login/
 /api/logout
 /api/verify

 =>

 /api/public/...
 /api/public/login/

 /api/private/...
 /api/private/logout
 /api/private/verify

 */

app.use('/api/public/model.json', falcorExpress.dataSourceRoute(publicDataSourceRouter));
app.use('/api/private/model.json', jwtCheck, falcorExpress.dataSourceRoute(privateDataSourceRouter));

app.use("/api/private", jwtCheck.unless(publicPath));
app.use("/api/private", utils.middleware().unless(publicPath));
app.use("/api", require(path.join(__dirname, "routes", "default.js"))());

// https://matoski.com/article/jwt-express-node-mongoose/#jwt
// http://netflix.github.io/falcor/documentation/router.html
// https://github.com/auth0/express-jwt

// serve static files from current directory
app.use(express.static(__dirname + '/'));

// all other requests redirect to 404
app.all("*", function (req, res, next) {
    next(new NotFoundError("404"));
});

// error handler for all the applications
app.use(function (err, req, res, next) {

    var errorType = typeof err,
        code = 500,
        msg = {message: "Internal Server Error"};

    switch (err.name) {
        case "UnauthorizedError":
            code = err.status;
            msg = undefined;
            break;
        case "BadRequestError":
        case "UnauthorizedAccessError":
        case "NotFoundError":
            code = err.status;
            msg = err.inner;
            break;
        default:
            break;
    }

    return res.status(code).json(msg);

});

var server = app.listen(port());