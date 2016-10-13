// logger
import Logger from '../log/Logger'
const logger = Logger.get();

import * as _ from 'lodash';
import * as path from 'path';

// model
//var User = require(path.join(__dirname, "..", "models", "user.js"));
import * as User from '../models/user';

var authenticate = function (req, res, next) {

    // get username and password from request body
    var username = req.body.username,
        password = req.body.password;

    logger.debug("Processing authenticate middleware with username [" + username + '] and password [' + password + ']');

    if (_.isEmpty(username) || _.isEmpty(password)) {
        return next(new UnauthorizedAccessError("401", {
            message: 'Username or password is empty'
        }));
    }

    logger.debug('username and password not empty. Go on...');

    process.nextTick(function () {

        User.findOne({
            username: username
        }, function (err, user) {

            if (err || !user) {

                logger.error('errore ' + err);
                return next(new UnauthorizedAccessError("401", {
                    message: 'Invalid username or password'
                }));
            }

            user.comparePassword(password, function (err, isMatch) {
                if (isMatch && !err) {
                    debug("User authenticated, generating token");
                    utils.create(user, req, res, next);
                } else {
                    return next(new UnauthorizedAccessError("401", {
                        message: 'Invalid username or password'
                    }));
                }
            });
        });

        /*
         utils.create({
         username: "Simone",
         password: "password",
         _id: "1"
         }, req, res, next);
         */
    });

};

module.exports = {
    authenticate: authenticate
}