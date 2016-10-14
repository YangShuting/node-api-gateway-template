# A stateless API Gateway with JWT auth and Falcor
It uses express, JWT, Redis for cache, Mongo for user data storage, ES6 (Babel), Rx js, Ramda. It's better to use the master module [simonedesordi/test-app-ops](https://github.com/simonedesordi/test-app-ops) to get a faster installation.

## Pre requirements
* install Docker
* install Node.js (better with nvm)
* configure api.test.com on your etc/hosts pointing to the VM IP running Docker
* npm install -g jasmine-node (if you want to execute automated tests)

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

Next release: 0.0.3
* fix Mongo integration (actually it doesn't work)
* introduce Kubernetes to enable a better deploy and remote/production management on cloud

Version 0.0.2
* added Node 6.x
* introduced automated integration test with [frisby](frisbyjs.com) module
* TODO complete logout automated test
* TODO complete Falcor paths verify

[![Build Status](https://travis-ci.org/simonedesordi/node-api-gateway-template.svg?branch=master)](https://travis-ci.org/simonedesordi/node-api-gateway-template)