// app arguments
import minimist from 'minimist';
const args = minimist(process.argv.slice(2));

// logger
import * as Logger from '../log/Logger.js';
Logger.build('debug'); //Logger.build(args.logLevel);
const logger = Logger.get();
logger.info('...setted application log level to ' + logger.level);

// redis
const getRedisInfo = () => {
    return {
        tcpAddress: process.env.REDIS_PORT_6379_TCP_ADDR,
        tcpPort: process.env.REDIS_PORT_6379_TCP_PORT
    }
};
logger.info("REDIS  -> " + getRedisInfo().tcpAddress + ':' + getRedisInfo().tcpPort);

const getPort = () => {
    var portGlobal = process.env.PORT;
    logger.info("portGlobal = " + portGlobal);

    var port = portGlobal /*|| portParameter*/ || '9090';
    logger.info("port = " + port);

    return port;
};

const PUBLIC_PATH = {
    path: [
        '/',
        '^/api/public/'
    ]
};

exports = module.exports = {
    getPort: getPort,
    getRedisInfo,
    PUBLIC_PATH: PUBLIC_PATH
};