/**
 * @file test.js
 * @description Test Suite for keki.
 * @author Capuccino
 * @license MIT  
 */

const config = require('./config.json');
const Keki = require('../');
const handler = new Keki(config.kekiURL || process.env.KEKI_CAKECHAT_URL, config.userAgent || 'Keki/1.0');
const assert = require('assert');

console.log('Starting Keki#getResponse....');

handler.getResponse(['uwu']).then(r => {
    assert(typeof r === 'object');
    console.log(r);
}).catch(err => {
    console.error('Test failed! Stack trace provided below.\n');
    console.error(err);
    process.exit(1);
});