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

//var authenticate = jwt({
//    secret: new Buffer('YOUR_CLIENT_SECRET', 'base64')
//});

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

var authenticate = jwt({secret: 'shhhhhhared-secret'});

app.use('/public-model.json', falcorExpress.dataSourceRoute(function (req, res) {
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
}));

app.use('/private-model.json', authenticate, falcorExpress.dataSourceRoute(function (req, res) {
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
}));

// serve static files from current directory
app.use(express.static(__dirname + '/'));

var server = app.listen(port());