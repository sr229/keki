/**
 * @file CakeChatHandler.js
 * @description A Handler module to handle CakeChat responses
 * @author Capuccino
 * @license MIT
*/
 
const https = require('https');
const URL = require('url');
const URL_REGEX = /^(https?:\/\/)?(((www\.)?[a-zA-Z0-9\.\-\_]+(\.[a-zA-Z]{2,3})+)|(\b(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\b))(:[0-9]+)?(\/[a-zA-Z0-9\_\-\s\.\/\?\%\#\&\=]*)?$/i; // eslint-disable-line

/**
  * Class that exposes all the methods to query to a cakechat instance
  * @class
*/
class Keki {
    /**
     * 
     * @param {String} url the URL for your instance. Must be a valid IP or hostname. 
     * @param {String} userAgent your user agent, this is added to your request headers. Defaults to Keki/1.0.
     */
    constructor(url, userAgent) {
        if (!URL_REGEX.test(url)) return new TypeError('url is not a valid hostname/IP');
        if (typeof url !== 'string') return new TypeError('url is not a string.');

        this.url = url;
        this.userAgent = userAgent;
    }

    /**
     * Gets Response from CakeChat Server
     * @param {Array} context The context to pass where the second index in the array is the current input
     * @returns {Promise<Object>} the response text.
     */
    getResponse(context) {
        return new Promise((resolve, reject) => {
            if (!Array.isArray(context)) reject('context is not an array.');
            else resolve(request('POST', `${this.url}/cakechat_api/v1/actions/get_response`, {
                headers: {
                    'Content-Type': 'application/json',
                    'User-Agent': this.userAgent || 'Keki/1.0'
                }

            }, JSON.stringify({
                context,
                from_cakechat: true
            })));
        }).then(body => { return body; });
    }
}

// simple request function for creating a Promisified HTTP/S request.
function request(method, url, options={}, payload) {
    return new Promise((resolve, reject) => {
        let req = https.request(Object.assign(URL.parse(url), options, {method}), res => {
            let chunked = '';

            if (res.statusCode !== 200) return reject(new Error(`HTTP ${res.statusCode}: ${res.statusMessage}`));

            res.setEncoding('utf8');
            res.on('data', chunk => chunked += chunk);
            res.on('error', reject);
            res.on('end', () => {
                let val;

                try {
                    val = JSON.parse(chunked);
                } catch(e) {
                    return resolve(chunked);
                }

                if (val.error) return reject(new Error(val.error));
                else return resolve(val);
            });
        });

        req.on('error', reject);
        if (payload) req.write(payload);
        req.end();
    });
}

module.exports = Keki;