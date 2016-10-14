// https://matoski.com/article/jwt-express-node-mongoose
// http://netflix.github.io/falcor/documentation/router.html
// https://github.com/Netflix/falcor-router
// https://github.com/auth0/express-jwt

require("babel-core/register");
require("babel-polyfill");

// init config
import * as init from './init/config.js';
import config from './init/config.json';

// logger
import * as Logger from './log/Logger.js';
const logger = Logger.get();

// express
var express = require('express'); //import * as express from 'express';
const app = express();
import unless from 'express-unless';
var falcorExpress = require('falcor-express'); //import * as falcorExpress from 'falcor-express';
var onFinished = require('on-finished');
import * as bodyParser  from 'body-parser';
app.use(require('morgan')("dev")); // log server
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(require('compression')());
app.use(require('response-time')());
import NotFoundError from './errors/NotFoundError.js';

//jwt
var jwt = require('express-jwt');

// routing
logger.info('...istantiate routers object');
import * as routers from './routes/default.js';

// authorization
var authorization = require('./auth/authorization');

// attach logging the request result on the end of every request
app.use(function (req, res, next) {

    onFinished(res, function (err) {

        if (err)
            logger.error('[%s] ERROR', err);

        logger.info('[%s] finished request', req.connection.remoteAddress);
    });

    next();
});

// JWT
var jwtCheck = jwt({
    secret: config.secret
});
jwtCheck.unless = unless;

/*
 API routes

 /api/public/...
 /api/public/login
 /api/public/logout
 /api/public/verify

 /api/private/...

 */

// set routers to routes
app.use('/api/public/model.json', falcorExpress.dataSourceRoute(routers.publicDataSourceRouter));
app.use("/api/public", routers.publicRouter());

app.use('/api/private/model.json', jwtCheck, falcorExpress.dataSourceRoute(routers.privateDataSourceRouter));
app.use("/api/private", jwtCheck.unless(init.PUBLIC_PATH));
app.use("/api/private", authorization.middleware().unless(init.PUBLIC_PATH));

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

// start server
var server = app.listen(init.getPort());