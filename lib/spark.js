'use strict';

const EventEmitter = require('events').EventEmitter;
const util = require('util');
const when = require('when');
const request = require('request');

const validator = require('./validator');

// spark resource methods
const contents = require('./res/contents');
const licenses = require('./res/licenses');
const memberships = require('./res/memberships');
const messages = require('./res/messages');
const organizations = require('./res/organizations');
const people = require('./res/people');
const roles = require('./res/roles');
const rooms = require('./res/rooms');
const teamMemberships = require('./res/team-memberships');
const teams = require('./res/teams');
const webhooks = require('./res/webhooks');

/**
 * Creates a Spark API instance that is then attached to a Spark Account.
 *
 * @constructor
 * @param {Object} options - Sparky options object
 */
function Spark(options) {
  EventEmitter.call(this);

  this.options = typeof options === 'object' ? options : {};

  // config defaults
  this.token = process.env.TOKEN || this.options.token || null;
  this.webhookSecret = process.env.WEBHOOK_SECRET || this.options.webhookSecret || null;
  this.webhookReqNamespace = this.options.webhookReqNamespace || 'body';

  // api url
  this.apiUrl = 'https://api.ciscospark.com/v1/';

  // attach resource methods
  contents(this);
  licenses(this);
  memberships(this);
  messages(this);
  organizations(this);
  people(this);
  roles(this);
  rooms(this);
  teamMemberships(this);
  teams(this);
  webhooks(this);
}
util.inherits(Spark, EventEmitter);

/**
 * Format Spark API Call, make http request, and validate response.
 *
 * @private
 * @param {String} method
 * @param {String} resource
 * @param {String} id
 * @param {Object} data
 * @returns {Promise.<Response>}
 */
Spark.prototype.request = function(method, resource, id, data, max) {
  // if token is not defined
  if(!this.token || typeof this.token !== 'string') {
    return when.reject(new Error('token not defined'));
  }

  let reMethod = /^(get|put|post|delete|form)$/i;
  let reResource = /^(contents|licenses|memberships|messages|organizations|people|roles|rooms|team\/memberships|teams|webhooks)$/i;

  // parse args
  let args = Array.prototype.slice.call(arguments);

  // validate method
  method = (args.length > 0 && typeof args[0] === 'string' && args[0].match(reMethod)) ? args.shift() : undefined;
  // validate resource
  resource = (args.length > 0 && typeof args[0] === 'string' && args[0].match(reResource)) ? args.shift() : undefined;
  // validate id
  id = (args.length > 0 && typeof args[0] === 'string') ? args.shift() : undefined;
  // validate data
  data = (args.length > 0 && typeof args[0] === 'object') ? args.shift() : {};
  // validate max
  max = (args.length > 0 && typeof args[0] === 'number') ? args.shift() : 0;

  // if required args are defined
  if(method && resource) {
    // define base url with optional id
    let url = id ? this.apiUrl + resource + '/' + id : this.apiUrl + resource;

    // define headers
    let headers = {
      'Authorization': 'Bearer ' + this.token,
      'Content-Type': 'application/json'
    };

    // define default request options
    let requestOptions = {
      url: url,
      headers: headers,
      time: true
    };

    // add options for "contents" resource
    if(resource.match(/^contents$/i)) {
      requestOptions.method = method;
      requestOptions.encoding = 'binary';
      requestOptions.json = false;
    }

    // add options for "form" method
    if(method.match(/^form$/i)) {
      requestOptions.method = 'post';
      requestOptions.formData = data;
      requestOptions.json = true;
    }

    // add options for "post" and "put" method
    if(method.match(/^(post|put)$/i)) {
      requestOptions.method = method;
      requestOptions.body = data;
      requestOptions.json = true;
    }

    // add options for "get" and "delete"
    if(method.match(/^(get|delete)$/i)) {
      requestOptions.method = method;
      requestOptions.qs = data;
      requestOptions.json = true;
    }

    // add max to request options (internally processed)
    requestOptions._max = max;

    let makeRequest = function(opts) {
      return when.promise((resolve, reject) => {
        request(opts, function(err, res) {
          if(err) {
            reject(err);
          } else if(res) {
            resolve(processResponse(res, opts));
          } else {
            reject(new Error('response not recieved'));
          }
        });
      });
    };

    let processResponse = function(res, opts) {
      let status;
      let headers;
      let body;

      // validate response
      if(!(res && typeof res === 'object')) {
        return when.reject(new Error('invalid response'));
      }

      // get/set status code
      if(res && res.hasOwnProperty('statusCode') && typeof res.statusCode === 'number') {
        status = res.statusCode;
      } else {
        status = 500;
      }

      // get/validate headers
      if(res && res.hasOwnProperty('headers') && typeof res.headers === 'object') {
        headers = res.headers;
      } else {
        return when.reject(new Error('invalid response headers'));
      }

      // if 204 delete
      if(status === 204) {
        return when({});
      }

      // if 429
      else if(status === 429) {
        // default retry delay
        let retryAfter = 15;

        // attempt to determine true delay from api headers
        if(headers && headers.hasOwnProperty('retry-after')) {
          retryAfter = headers['retry-after'];
        }

        // emit rate-limited event
        if(retryAfter > 0) {
          console.log('Spark API rate limit exceeded and response will be delayed for %ssec before being reattempted', retryAfter);
        }

        return when(true).delay(retryAfter * 1000).then(() => makeRequest(opts));
      }

      // if 200
      else if(status === 200) {
        // get/validate body
        if(res && res.hasOwnProperty('body') && typeof res.body === 'object') {
          body = res.body;
        } else {
          return when.reject(new Error('invalid response body'));
        }

        // if response is array
        if(body.hasOwnProperty('items') && Array.isArray(body.items)) {
          // parse max from request opts
          let maxResults = opts._max || 0;

          // if link header
          if(headers.hasOwnProperty('link')) {

            // parse link from header
            let parsedLink = headers.link.match(/(http.*)>/);
            let url = parsedLink && Array.isArray(parsedLink) && parsedLink.length > 1 ? parsedLink[1] : null;

            // array to hold accumulated items
            let items = [];

            // populate items array
            if(opts.hasOwnProperty('_items')) items = opts._items.concat(body.items);
            else items = body.items;

            // if maxResults retrieved, return accumulated items
            if(maxResults > 0 && items.length > maxResults) {
              return when(items.slice(0, maxResults));
            }

            // if requesting next page...
            if(url) {
              // construct request for next page
              let pOpts = JSON.parse(JSON.stringify(opts));
              pOpts.url = url;
              pOpts._items = items;

              // request next page (recursive)
              return makeRequest(pOpts);
            }

            // else, link header does not exist, return current accumulated items
            else {
              return when(items);
            }
          }

          //  else, no pagination link
          else {
            if(opts.hasOwnProperty('_items')) {
              body.items = opts._items.concat(body.items);
            }

            if(maxResults > 0 && body.items.length > maxResults) {
              return when(body.items.slice(0, maxResults));
            } else {
              return when(body.items);
            }
          }
        }

        // else response is single object
        else {
          return when(body);
        }
      }

      // else other response status
      else {
        let errMessage = util.format('recieved error %s for a %s request to %s', status, opts.method.toUpperCase(), opts.url);
        console.log(errMessage);
        return when.reject(new Error(errMessage));
      }
    };

    return makeRequest(requestOptions);
  } else {
    let errMessage = 'missing required arguemnts';
    console.log(errMessage);
    return when.reject(new Error(errMessage));
  }
};

module.exports = Spark;
