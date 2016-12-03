# A stateless API Gateway with JWT auth and Falcor
It uses express, JWT, Redis for cache, Mongo for user data storage, ES6 (Babel), Rx js, Ramda. It's better to use the master module [simonedesordi/test-app-ops](https://github.com/simonedesordi/test-app-ops) to get a faster installation.

## Pre requirements
* install Docker
* install Node.js (better with nvm)
* configure api.test.com on your etc/hosts pointing to the VM IP where Docker is running
* npm install -g jasmine-node (if you want to execute automated tests)

## UI
Module [simonedesordi/test-app-ops](https://github.com/simonedesordi/test-app-ops) also contains a simple HTML UI useful to call API URIs with simple clicks. Just open http://www.test.com/ on a browser window.

## Useful commands

To build ES6 files:
```
npm run-script build
```

To run tests:
```
npm test
```

To run API:
```
npm start
```

## Exposed URLs:
* GET /api/public/verify
* GET /api/public/logout
* POST /api/public/login

## Versions

Future: 0.4.0
* introduce Kubernetes to enable a better deploy and remote/production management on cloud

Next release: 0.3.0
* fix Mongo integration (actually it doesn't work)
* verify token creation and authorization in a multiuser scenario
* create a UI node with login/logout feature and dismiss the simple UI actually in [simonedesordi/test-app-ops](https://github.com/simonedesordi/test-app-ops)

Actual version: 0.2.0
* added Node 6.x
* introduced automated integration tests with [frisby](frisbyjs.com) module

[![Build Status](https://travis-ci.org/simonedesordi/node-api-gateway-template.svg?branch=master)](https://travis-ci.org/simonedesordi/node-api-gateway-template)