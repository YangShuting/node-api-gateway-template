require("babel-core/register");
require("babel-polyfill");

import minimist from 'minimist';
import winston from 'winston';
const log = winston;
log.level = 'debug';

const args = minimist(process.argv.slice(2));

var express = require('express');
var app = express();
var falcorExpress = require('falcor-express');
var Router = require('falcor-router');
import jwt from 'express-jwt'

var debug = require('debug')('app:' + process.pid),
    path = require("path"),
    fs = require("fs"),
    http_port = process.env.HTTP_PORT || 3000,
    https_port = process.env.HTTPS_PORT || 3443,
    config = require("./config.json"),
    onFinished = require('on-finished'),
    NotFoundError = require(path.join(__dirname, "errors", "NotFoundError.js")),
    utils = require(path.join(__dirname, "utils.js")),
    unless = require('express-unless');

debug("Attaching plugins");
app.use(require('morgan')("dev")); // log server
var bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(require('compression')());
app.use(require('response-time')());

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

app.use(jwtCheck.unless({path: '/api/login' }));
app.use(utils.middleware().unless({path: '/api/login' }));
app.use("/api", require(path.join(__dirname, "routes", "default.js"))());

// all other requests redirect to 404
app.all("*", function (req, res, next) {
    next(new NotFoundError("404"));
});

// error handler for all the applications
app.use(function (err, req, res, next) {

    var errorType = typeof err,
        code = 500,
        msg = { message: "Internal Server Error" };

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

// https://matoski.com/article/jwt-express-node-mongoose/#jwt
// http://netflix.github.io/falcor/documentation/router.html
// https://github.com/auth0/express-jwt

var port = function () {
    var portGlobal = process.env.PORT;
    console.log("portGlobal = " + portGlobal);

    var port = portGlobal /*|| portParameter*/ || '9090';
    console.log("port = " + port);

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
                return {path: ["greeting"], value: "Hello"};
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
                console.log(res.user);
                return {path: ["login"], value: "Hello World"};
            }
        }
    ]);
};

var authenticate = jwt({secret: 'shhhhhhared-secret'});

app.use('/api/public-model.json', falcorExpress.dataSourceRoute(publicDataSourceRouter));
app.use('/api/private-model.json', authenticate, falcorExpress.dataSourceRoute(privateDataSourceRouter));
// serve static files from current directory
app.use(express.static(__dirname + '/'));

var server = app.listen(port());