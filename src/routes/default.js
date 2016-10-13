// logger
import Logger from '../log/Logger'
const logger = Logger.get();

// Falcor
import * as falcorRouter from 'falcor-router';

// express
import Router from 'express';

// authentication
import {authenticate} from '../auth/authentication.js';

// authorization
import * as utils from '../utils';

// errors
import UnauthorizedAccessError from '../errors/UnauthorizedAccessError';

const publicRouter = () => {

    var router = new Router();

    router.route("/verify").get(function (req, res, next) {
        return res.status(200).json(undefined);
    });

    router.route("/logout").get(function (req, res, next) {

        logger.info("Logout called");
        if (utils.expire(req.headers)) {
            delete req.user;
            return res.status(200).json({
                "message": "User has been successfully logged out"
            });
        } else {
            return next(new UnauthorizedAccessError("401"));
        }
    });

    router.route("/login").post(authenticate, function (req, res, next) {
        logger.info("Login end. Now return");
        return res.status(200).json(req.user);
    });

    router.unless = require("express-unless");

    return router;
};


const publicDataSourceRouter = function (req, res) {
    // create a Virtual JSON resource with single key ("greeting")
    return new falcorRouter.Router([
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
    return new falcorRouter.Router([
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

module.exports = {
    publicRouter: publicRouter,
    publicDataSourceRouter: publicDataSourceRouter,
    privateDataSourceRouter: privateDataSourceRouter
};