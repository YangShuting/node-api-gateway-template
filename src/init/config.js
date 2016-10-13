// app arguments
import minimist from 'minimist';
const args = minimist(process.argv.slice(2));

import * as Logger from '../log/Logger.js';
Logger.build('debug'); //Logger.build(args.logLevel);
const logger = Logger.get();
logger.info('...setted application log level to ' + logger.level);

logger.info("REDIS  -> " + process.env.REDIS_PORT_6379_TCP_ADDR + ':' + process.env.REDIS_PORT_6379_TCP_PORT);

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
    PUBLIC_PATH: PUBLIC_PATH
};