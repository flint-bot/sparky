const { EventEmitter } = require('events');
const debug = require('debug')('node_sparky');
const when = require('when');
const request = require('request');
const _ = require('lodash');
const generator = require('./generator');
const validator = require('./validator');

// spark resource methods
const contents = require('./res/contents');
const events = require('./res/events');
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
 * @description Creates a Spark API instance that is then attached to a Spark Account.
 *
 * @constructor
 * @param {Object.<Options>} options - Sparky options object
 * @property {Object.<Options>} options - Sparky options object
 *
 * @example
 * const Spark = require('node-sparky');
 *
 * const spark = new Spark({
 *   token: '<my token>',
 *   webhookSecret: 'somesecr3t',
 * });
 *
 * spark.roomsGet(10)
 *   .then(rooms => rooms.forEach(room => console.log(room.title)))
 *   .catch(err => console.log(err);
 */
class Spark extends EventEmitter {

  constructor(options) {
    super();
    this.options = validator.isOptions(options) ? options : {};

    // config defaults
    this.token = this.options.token || process.env.SPARKY_API_TOKEN || process.env.TOKEN || null;
    this.webhookSecret = this.options.webhookSecret || process.env.SPARKY_WEBHOOK_SECRET || process.env.WEBHOOK_SECRET || generator.base62(32);
    this.webhookReqNamespace = this.options.webhookReqNamespace || 'body';
    this.maxPageItems = this.options.maxPageItems || 100;

    // api url
    this.apiUrl = this.options.apiUrl || process.env.SPARKY_API_URL || process.env.API_URL || 'https://api.ciscospark.com/v1/';

    // attach resource methods
    _.merge(this, contents(this));
    _.merge(this, events(this));
    _.merge(this, licenses(this));
    _.merge(this, memberships(this));
    _.merge(this, messages(this));
    _.merge(this, organizations(this));
    _.merge(this, people(this));
    _.merge(this, roles(this));
    _.merge(this, rooms(this));
    _.merge(this, teamMemberships(this));
    _.merge(this, teams(this));
    _.merge(this, webhooks(this));
  }

  /**
   * @description Set/Reset API token used in a Sparky instance. Use this function when needing
   * to change an expired Token. Returns a fullfiled promise if token is valid,
   * else returns a rejected promise.
   *
   * @param {String} token Spark API token
   * @returns {Promise.String} Token promise
   *
   * @example
   * spark.setToken('Tm90aGluZyB0byBzZWUgaGVyZS4uLiBNb3ZlIGFsb25nLi4u')
   *   .then(token => console.log(token))
   *   .catch(err => console.error(err));
   */
  setToken(token) {
    return validator.isToken(token)
      .then((vaildToken) => {
        this.token = vaildToken;
        return when(vaildToken);
      });
  }

  /**
   * @description Format Spark API Call, make http request, and validate response.
   *
   * @private
   * @param {String} method API Method
   * @param {String} resource Spark API Edpoint
   * @param {String} [id] Record identifier
   * @param {Object} [data] Data body
   * @param {Number} [m] Max results returned
   * @returns {Promise.<Response>} Response promise
   */
  request(...args) {
    // if token is not defined
    if (!this.token || typeof this.token !== 'string') {
      return when.reject(new Error('token not defined'));
    }

    const reMethod = /^(get|put|post|delete|form)$/i;
    const reResource = /^(contents|events|licenses|memberships|messages|organizations|people|roles|rooms|team\/memberships|teams|webhooks)$/i;

    // validate method
    const method = (args.length > 0 && typeof args[0] === 'string' && args[0].match(reMethod)) ? args.shift() : undefined;
    // validate resource
    const resource = (args.length > 0 && typeof args[0] === 'string' && args[0].match(reResource)) ? args.shift() : undefined;
    // validate id
    const id = (args.length > 0 && typeof args[0] === 'string') ? args.shift() : undefined;
    // validate data
    const data = (args.length > 0 && typeof args[0] === 'object') ? args.shift() : {};
    // validate max
    const m = (args.length > 0 && typeof args[0] === 'number') ? args.shift() : 0;

    // if required args are defined
    if (method && resource) {
      // define base url with optional id
      const url = id ? `${this.apiUrl}${resource}/${id}` : `${this.apiUrl}${resource}`;

      // define headers
      const headers = {
        Authorization: `Bearer ${this.token}`,
        'Content-Type': 'application/json',
      };

      // define default request options
      const requestOptions = {
        url: url,
        headers: headers,
        time: true,
      };

      // add options for "contents" resource
      if (resource.match(/^contents$/i)) {
        requestOptions.method = method;
        requestOptions.encoding = 'binary';
        requestOptions.json = false;
      }

      // add options for "form" method
      if (method.match(/^form$/i)) {
        requestOptions.method = 'post';
        requestOptions.formData = data;
        requestOptions.json = true;
      }

      // add options for "post" and "put" method
      if (method.match(/^(post|put)$/i)) {
        requestOptions.method = method;
        requestOptions.body = data;
        requestOptions.json = true;
      }

      // add options for "get" and "delete"
      if (method.match(/^(get|delete)$/i)) {
        requestOptions.method = method;
        requestOptions.qs = data;
        requestOptions.json = true;
      }

      // add max to request options (internally processed)
      requestOptions.max = m;

      const makeRequest = (opts, resProcessor) => when.promise((resolve, reject) => {
        request(opts, (err, res) => {
          if (err) {
            reject(err);
          } else if (res) {
            resolve(resProcessor(res, opts));
          } else {
            reject(new Error('response not received'));
          }
        });
      });

      const processResponse = (res, opts) => {
        // validate response
        if (!(res && typeof res === 'object')) {
          return when.reject(new Error('invalid response'));
        }

        // verify headers
        if (res && _.has(res, 'headers') && typeof res.headers !== 'object') {
          return when.reject(new Error('invalid response headers'));
        }

        // verify normalize status code
        if (res && _.has(res, 'statusCode') && typeof res.statusCode !== 'number') {
          res.statusCode = 500;
        }

        const process200 = (_res, _opts) => {
          // if response body does not exist
          if (!_.has(_res, 'body')) {
            return when.reject(new Error('invalid response body'));
          }

          // if response body is string with binary encoded data
          if (typeof _res.body === 'string'
            && _.has(_res.headers, 'content-disposition')
            && _.has(_res.headers, 'content-type')
          ) {
            return when(_res);
          }

          // if response body is object
          if (typeof _res.body === 'object') {
            // if response is array of objects
            if (_.has(_res.body, 'items') && _res.body.items instanceof Array) {
              let resItems = _res.body.items;

              // parse max from request opts
              const maxItems = _opts.max || 0;

              if (_.has(_res.headers, 'link')) {
                // parse link from header
                let parsedLink = _res.headers.link.match(/(http.*)>/); // returns array
                parsedLink = parsedLink && Array.isArray(parsedLink) && parsedLink.length > 1
                  ? parsedLink[1]
                  : null;

                // array to hold accumulated items
                let items = [];

                // populate items array
                if (_.has(_opts, 'catItems')) {
                  items = _opts.catItems.concat(resItems);
                } else {
                  items = resItems;
                }

                // if max retrieved, return accumulated items
                if (maxItems > 0 && items.length > maxItems) {
                  return when(items.slice(0, maxItems));
                }

                // if requesting next page...
                if (parsedLink) {
                  // construct request for next page
                  const pOpts = _.cloneDeep(_opts);
                  pOpts.url = parsedLink;
                  pOpts.catItems = items;

                  // request next page (recursive)
                  return makeRequest(pOpts, processResponse);
                }
              }

              if (_.has(opts, 'catItems')) {
                resItems = opts.catItems.concat(resItems);
              }

              if (maxItems > 0 && resItems.length > maxItems) {
                return when(resItems.slice(0, maxItems));
              }

              return when(resItems);
            }
            // body is single object
            return when(_res.body);
          }

          return when.reject(new Error('invalid response body'));
        };

        const process204 = (_res, _opts) => when({});

        const process429 = (_res, _opts) => {
          // default retry delay
          let retryAfter = 15;

          // attempt to determine true delay from api headers
          if (_.has(_res.headers, 'retry-after')) {
            retryAfter = _res.headers['retry-after'];
          }

          // log rate-limited event
          if (retryAfter > 0) {
            debug(`Spark API rate limit exceeded and response will be delayed for ${retryAfter}s before being reattempted`);
          }

          return when(true)
            .delay(retryAfter * 1000)
            .then(() => makeRequest(_opts, processResponse));
        };

        const processError = (_res, _opts) => {
          const err = new Error(`recieved error ${_res.statusCode} for a ${_opts.method.toUpperCase()} request to ${_opts.url}`);
          // attach statusCode to error.code
          err.code = _res.statusCode;
          // attach err.type
          if (parseInt(_res.statusCode, 10) === 400) {
            err.type = 'ERR_REQUEST';
          } else if (parseInt(_res.statusCode, 10) === 401) {
            err.type = 'ERR_UNAUTHORIZED';
          } else if (parseInt(_res.statusCode, 10) === 403) {
            err.type = 'ERR_FORBIDDEN';
          } else if (parseInt(_res.statusCode, 10) === 409) {
            err.type = 'ERR_CONFLICT';
          } else if (parseInt(_res.statusCode, 10) === 415) {
            err.type = 'ERR_MEDIA';
          } else if (parseInt(_res.statusCode, 10) === 429) {
            err.type = 'ERR_RATELIMIT';
          } else {
            err.type = 'ERR_STATUS';
          }
          debug(err);
          return when.reject(err);
        };

        // process by status code
        if (res.statusCode === 204) {
          return process204(res, opts);
        } else if (res.statusCode === 429) {
          return process429(res, opts);
        } else if (res.statusCode === 200) {
          return process200(res, opts);
        }
        return processError(res, opts);
      };

      return makeRequest(requestOptions, processResponse);
    }

    const err = new Error('missing required arguements');
    debug(err);
    return when.reject(err);
  }

}

module.exports = Spark;
