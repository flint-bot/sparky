'use strict';

const when = require('when');
const crypto = require('crypto');

const validator = require('../validator');

// xor function
const xor = function(a,b) {
  return (a || b) && !(a && b);
};

/**
 * Webhook Object
 *
 * @namespace Webhook
 * @property {String} id - Webhook ID
 * @property {String} name - Webhook name
 * @property {String} targetUrl - Webhook target URL
 * @property {String} resource - Webhook resource
 * @property {String} event - Webhook event
 * @property {String} filter - Webhook filter
 * @property {Date} created - Date Webhook created
 */

module.exports = function(Spark) {

  /**
   * Return all Spark Webhooks that the authenticated account is in. If 'max' is not specifed, returns all.
   *
   * @function
   * @param {Integer} [max] - Number of records to return
   * @returns {Promise.Array.<Webhook>} Webhooks Collection
   *
   * @example
   * spark.webhooksGet(100)
   *   .then(function(webhooks) {
   *     // process webhooks as array
   *     webhooks.forEach(function(webhook) {
   *       console.log(webhook.name);
   *     });
   *   })
   *   .catch(function(err) {
   *     // process error
   *     console.log(err);
   *   });
   */
  Spark.webhooksGet = function(maxResults) {
    return Spark.request('get', 'webhooks', { max: Spark.maxPageItems }, maxResults);
  };

  /**
   * Returns details of Spark Webhook Object specified by Webhook ID.
   *
   * @function
   * @param {String} webhookId - Spark Webhook ID
   * @returns {Promise.<Webhook>} Webhook
   *
   * @example
   * spark.webhookGet('Tm90aGluZyB0byBzZWUgaGVyZS4uLiBNb3ZlIGFsb25nLi4u')
   *   .then(function(webhook) {
   *     console.log(webhook.name);
   *   })
   *   .catch(function(err) {
   *     // process error
   *     console.log(err);
   *   });
   */
  Spark.webhookGet = function(webhookId) {
    return Spark.request('get', 'webhooks', webhookId);
  };

  /**
   * Add new Webhook.
   *
   * @function
   * @param {Object.<Webhook>} webhook - Spark Webhook Object
   * @returns {Promise.<Webhook>} Webhook
   *
   * @example
   * let newWebhook = {
   *   name: 'my webhook',
   *   targetUrl: 'https://example.com/webhook',
   *   resource: 'memberships',
   *   event: 'created',
   *   filter: 'roomId=Tm90aGluZyB0byBzZWUgaGVyZS4uLiBNb3ZlIGFsb25nLi4u'
   * };
   *
   * spark.webhookAdd(newWebhook)
   *   .then(function(webhook) {
   *     console.log(webhook.name);
   *   })
   *   .catch(function(err) {
   *     // process error
   *     console.log(err);
   *   });
   */
  Spark.webhookAdd = function(webhook) {
    // if person object is valid
    if(webhook && typeof webhook === 'object' && validator.isWebhook(webhook)) {
      // add webhook
      return Spark.request('post', 'webhooks', webhook);
    }

    // else, invalid arguments
    else {
      return when.reject(new Error('invalid or missing webhook object'));
    }
  };

  /**
   * Update a Webhook.
   *
   * @function
   * @param {Object.<Webhook>} webhook - Spark Webhook Object
   * @returns {Promise.<Webhook>} Webhook
   *
   * @example
   * spark.webhookGet(Tm90aGluZyB0byBzZWUgaGVyZS4uLiBNb3ZlIGFsb25nLi4u)
   *   .then(function(webhook) {
   *     // change value of retrieved webhook object
   *     webhook.name = 'Another Webhook';
   *     return spark.webhookUpdate(webhook);
   *   )
   *   .then(function(webhook) {
   *     console.log(webhook.name);
   *   })
   *   .catch(function(err) {
   *     // process error
   *     console.log(err);
   *   });
   */
  Spark.webhookUpdate = function(webhook) {
    // if webhook object is valid
    if(webhook && typeof webhook === 'object' && validator.isWebhook(webhook)) {
      // update the webhook
      return Spark.request('put', 'webhooks', webhook.id, webhook);
    }

    // else, invalid arguments
    else {
      return when.reject(new Error('invalid or missing webhook object'));
    }
  };

  /**
   * Remove Spark Webhook by ID.
   *
   * @function
   * @param {String} webhookId - Spark Webhook ID.
   * @returns {Promise}
   *
   * @example
   * spark.webhookRemove('Tm90aGluZyB0byBzZWUgaGVyZS4uLiBNb3ZlIGFsb25nLi4u')
   *   .then(function() {
   *     console.log('Webhook removed');
   *   })
   *   .catch(function(err){
   *     console.log(err);
   *   });
   */
  Spark.webhookRemove = function(webhookId) {
    return Spark.request('delete', 'webhooks', webhookId)
      .then(res => when(true));
  };

  /**
   * Authenticate X-Spark-Signature HMAC-SHA1 Hash.
   *
   * @function
   * @param {String} secret - Value of secret used when creating webhook
   * @param {String} signature - Value of "X-Spark-Signature" from header
   * @param {(String|Object)} payload - This can either be the json object or a string representation of the webhook's body json payload
   * @returns {Promise.String|Object} payload
   *
   * @example
   * let sig = req.headers['x-spark-signature'];
   * let secret = 'mySecret';
   *
   * spark.webhookAuth(secret, sig, req.body)
   *   .then(function() {
   *     // webhook is valid
   *   })
   *   .catch(function(err) {
   *     // webhook is invalid
   *   });
   */
  Spark.webhookAuth = function(secret, sig, payload) {
    // promisfy JSON.stringify()
    let jsonStringify = when.lift(JSON.stringify);

    let strPayload;
    // if json object...
    if(typeof payload === 'object') {
      strPayload = jsonStringify(payload);
    } else if(typeof payload === 'string') {
      strPayload = when(payload);
    }

    //validate
    if(typeof sig === 'string' && typeof secret === 'string') {
      let hmac = crypto.createHmac('sha1', secret);

      return when(strPayload)
        .then(pl => {
          hmac.update(pl);
          if(sig === hmac.digest('hex')) {
            return when(payload);
          } else {
            return when.reject(new Error('received an invalid payload'));
          }
        });
    } else {
      return when.reject(new Error('received a request with missing or invalid function arguments'));
    }
  };

  /**
   * Process request from connect, express, or resitify routes. Return function
   * that accepts req, res, and next arguments.
   *
   * @returns {Spark.webhookListen~webhookHandler} function
   *
   * @example
   * "use strict";
   *
   * const Spark = require('node-sparky');
   * const express = require('express');
   * const bodyParser = require('body-parser');
   * const path = require('path');
   *
   * const spark = new Spark({
   *   token: '<my token>',
   *   webhookSecret: 'somesecr3t',
   *   webhookReqNamespace: 'body'
   * });
   *
   * // add events
   * spark.on('messages', function(event, message, req) {
   *   if(event === 'created') {
   *     spark.messageGet(message.id)
   *       .then(function(message) {
   *         console.log('%s said %s', message.personEmail, message.text);
   *       })
   *       .catch(function(err) {
   *         console.log(err);
   *       });
   *   }
   * });
   *
   * spark.on('request', function(req) {
   *   console.log('%s.%s web hook received', hook.resource, hook.event);
   * });
   *
   * const app = express();
   * app.use(bodyParser.json());
   *
   * // add route for path that which is listening for web hooks
   * app.post('/webhook', spark.webhookListen());
   *
   * // start express server
   * const server = app.listen('3000', function() {
   *   // create spark webhook directed back to express route defined above
   *   spark.webhookAdd({
   *     name: 'my webhook',
   *     targetUrl: 'https://example.com/webhook',
   *     resource: 'messages',
   *     event: 'created'
   *   });
   *   console.log('Listening on port %s', '3000');
   * });
   */
  Spark.webhookListen = function() {

    /**
     * Function returned by spark.webhookListen()
     *
     * @param {Object} req - request object
     * @param {Object} [res] - response object
     * @param {Function} [next] - next function
     */
    let webhookHandler = function(req, res, next) {
      // promisfy JSON.parse()
      let jsonParse = when.lift(JSON.stringify);

      // process webhook body
      let processBody = function(bodyObj) {
        let _resource = bodyObj.hasOwnProperty('resource') ? bodyObj.resource.toLowerCase() : null;
        let _event = bodyObj.hasOwnProperty('event') ? bodyObj.event.toLowerCase() : null;
        let _data = bodyObj.hasOwnProperty('data') ? bodyObj.data : null;

        if(_resource && _event && _data) {
          /**
           * Webhook membership event
           *
           * @event memberships
           * @type object
           * @property {String} event - Triggered event (created, updated, deleted)
           * @property {Object.<Membership>} membership - Membership Object found in Webhook
           * @property {Object.<Request>} req - Full Request Object
           */

          /**
           * Webhook messages event
           *
           * @event messages
           * @type object
           * @property {String} event - Triggered event (created, deleted)
           * @property {Object.<Message>} message - Message Object found in Webhook
           * @property {Object.<Request>} req - Full Request Object
           */

          /**
           * Webhook rooms event
           *
           * @event rooms
           * @type object
           * @property {String} event - Triggered event (created, updated)
           * @property {Object.<Room>} room - Room Object found in Webhook
           * @property {Object.<Request>} req - Full Request Object
           */

          Spark.emit(_resource, _event, _data, req);

          /**
           * Webhook request event
           *
           * @event request
           * @type object
           * @property {Object.<Request>} req - Full Request Object
           */

          Spark.emit('request', req);
        } else {
          console.log('node-sparky/webhooks received invalid request');
        }
      };

      // send response
      let sendResponse = function(status, text) {
        if(typeof res !== 'undefined') {
          res.status(status);
          res.send(text);
        }
      };

      // validate "req"
      if(req && req.hasOwnProperty('headers') && req.hasOwnProperty(Spark.webhookReqNamespace)) {
        // headers
        let headers = req.headers;

        // body
        let body = {};
        if(typeof req[Spark.webhookReqNamespace] === 'object') {
          body = when(req[Spark.webhookReqNamespace]);
        } else if(typeof req[Spark.webhookReqNamespace] === 'string') {
          body = jsonParse(req[Spark.webhookReqNamespace]);
        }

        // hmac signature
        let sig = headers.hasOwnProperty('x-spark-signature') ? headers['x-spark-signature'] : null;

        if(sig && Spark.webhookSecret) {
          when(body)
            .then(bodyObj => Spark.webhookAuth(Spark.webhookSecret, sig, bodyObj))
            .then(bodyObj => {
              processBody(bodyObj);
              sendResponse(200, 'OK');
            })
            .catch(err => {
              console.log('node-sparky/webhooks %s', err.message);
              sendResponse(401, 'Unauthorized');
            });
        }

        else if(xor(sig, Spark.webhookSecret)) {
          if(sig) console.log('node-sparky/webhooks received "x-spark-signature" header but no secret defined');
          if(Spark.webhookSecret) console.log('node-sparky/webhooks secret defined but "x-spark-signature" header field not found');
          sendResponse(401, 'Unauthorized');
        }

        else {
          when(body)
            .then(bodyObj => {
              processBody(bodyObj);
              sendResponse(200, 'OK');
            })
            .catch(err => {
              console.log('node-sparky/webhooks %s', err.message);
              sendResponse(401, 'Unauthorized');
            });
        }
      }

      // else, invalid request
      else {
        console.log('node-sparky/webhooks received invalid request');
        sendResponse(400, 'Invalid');
      }
    };

    return webhookHandler;
  };

  // return the Spark Object
  return Spark;
 };
