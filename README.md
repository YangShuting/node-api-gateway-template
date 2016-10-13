### A stateless API Gateway with auth and Falcor
It uses express, JWT, redis for cache, ES6 (Babel), Rx js, Ramda

Exposed URLs:
* GET /api/public/verify
* GET /api/public/logout
* POST /api/public/login

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

[![Build Status](https://travis-ci.org/simonedesordi/node-api-gateway-template.svg?branch=master)](https://travis-ci.org/simonedesordi/node-api-gateway-template)