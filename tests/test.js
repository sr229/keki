/**
 * @file test.js
 * @description Test Suite for keki.
 * @author Capuccino
 * @license MIT  
 */

const Keki = require('../');
const config = require('./config.json');
const handler = new Keki(config.kekiURL || process.env.KEKI_URL, config.kekiUserAgent || 'Keki/1.0');
const assert = require('assert');

(async () => {
    console.log('Testing `Keki#getResponse`');
    let res = await handler.getResponse(["What's up?"]);
    assert(typeof res === 'object');
    console.log(res);
    console.log('\n\n');

})().then(() => {
    console.log('All tests completed.');
    process.exit(0);
}).catch(err => {
    console.error(err);
    process.exit(1);
});