require("babel-core/register");
require("babel-polyfill");

import minimist from 'minimist';
import winston from 'winston';
const log = winston;
log.level = 'debug';

const args = minimist(process.argv.slice(2));

console.log("node-template istalled!!");