const Logger = require('../Logger').build('debug');
const debug = require('../Logger').debug;

test('test on debug', () => {
    debug('CIAOOOO %s , COME VA?', 'SIMONEEEE');
});