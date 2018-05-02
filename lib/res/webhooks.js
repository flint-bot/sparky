const debug = require('debug')('node_sparky');
const when = require('when');
const crypto = require('crypto');
const _ = require('lodash');
const validator = require('../validator');

// xor function
const xor = (a, b) => ((a || b) && !(a && b));

// promisfy JSON.stringify
const jsonStringify = when.lift(JSON.stringify);

// promisfy JSON.parse()
const jsonParse = when.lift(JSON.parse);

// timing safe string compare function
const cryptoTimingSafeEqualStr = (a, b) => {
  if (typeof a === 'string' && typeof b === 'string') {
    const bufA = Buffer.from(a);
    const bufB = Buffer.from(b);

    return crypto.timingSafeEqual(bufA, bufB);
  }
  return false;
};

/**
 * @description Webhook Object
 *
 * @namespace Webhook
 * @property {String} id - Webhook ID
 * @property {String} name - Webhook name
 * @property {String} targetUrl - Webhook target URL
 * @property {String} resource - Webhook resource
 * @property {String} event - Webhook event
 * @property {String} filter - Webhook filter
 * @property {String} created - Date Webhook created (ISO 8601)
 */

const Webhooks = (Spark) => {
  const webhooks = {
    /**
     * @description Returns all webhooks for authenticated account with optional
     * search criteria to filter results. If 'max' is not specifed, returns all.
     *
     * @memberof Spark
     * @function
     * @param {Object} [webhookSearch] Webhook Search object
     * @param {Integer} [max] Number of records to return
     * @returns {Promise.Array.<Webhook>} Array of Spark Webhook objects
     *
     * @example
     * spark.webhooksGet(10)
     *   .then(webhooks => webhooks.forEach(webhook => console.log(webhook.name)))
     *   .catch(err => console.error(err));
     *
     * @example
     * spark.webhooksGet({ name: 'My Awesome Webhook' }, 10)
     *   .then(webhooks => webhooks.forEach(webhook => console.log(webhook.name)))
     *   .catch(err => console.error(err));
     */
    webhooksGet: (...args) => {
      const webhookSearch = args.length > 0 && typeof args[0] === 'object' ? args.shift() : undefined;
      const maxResults = args.length > 0 && typeof args[0] === 'number' ? args.shift() : undefined;

      return Spark.request('get', 'webhooks', { max: Spark.maxPageItems }, 0)
        .then((webhooksAll) => {
          if (webhookSearch && validator.isWebhookSearch(webhookSearch)) {
            return when(_.filter(webhooksAll, webhookSearch).slice(0, maxResults));
          }
          return when(webhooksAll);
        });
    },

    // Deprecated webhooksSearch function (to be removed in Sparky 5) // TODO
    webhooksSearch: (...args) => webhooks.webhooksGet.apply(null, args),

    /**
     * @description Returns details of Spark Webhook Object specified by Webhook ID.
     *
     * @memberof Spark
     * @function
     * @param {String} webhookId Spark Webhook ID
     * @returns {Promise.<Webhook>} Spark Webhook object
     *
     * @example
     * spark.webhookGet('Tm90aGluZyB0byBzZWUgaGVy')
     *   .then(webhook => console.log(webhook.name))
     *   .catch(err => console.error(err));
     */
    webhookGet: (webhookId) => {
      if (typeof webhookId !== 'string') {
        return when.reject(new Error('invalid arguments'));
      }
      return Spark.request('get', 'webhooks', webhookId);
    },

    /**
     * @description Add new Webhook.
     *
     * @memberof Spark
     * @function
     * @param {Object.<Webhook>} webhookObj Spark Webhook object
     * @returns {Promise.<Webhook>} Spark Webhook object
     *
     * @example
     * const newWebhook = {
     *   name: 'my webhook',
     *   targetUrl: 'https://example.com/webhook',
     *   resource: 'memberships',
     *   event: 'created',
     *   filter: 'roomId=Tm90aGluZyB0byBzZWUgaGVy'
     * };
     *
     * spark.webhookAdd(newWebhook)
     *   .then(webhook => console.log(webhook.name))
     *   .catch(err => console.error(err));
     */
    webhookAdd: (webhookObj) => {
      if (webhookObj && typeof webhookObj === 'object' && validator.isWebhook(webhookObj)) {
        // add secret if defined in Spark.options but not specificed as part of webhookObj
        if (_.has(Spark, 'webhookSecret') && !_.has(webhookObj, 'webhookSecret')) {
          const updatedWebhookObj = _.cloneDeep(webhookObj);
          updatedWebhookObj.secret = Spark.webhookSecret;
          return Spark.request('post', 'webhooks', updatedWebhookObj);
        }
        return Spark.request('post', 'webhooks', webhookObj);
      }
      return when.reject(new Error('invalid or missing webhook object'));
    },

    /**
     * @description Update a Webhook.
     *
     * @memberof Spark
     * @function
     * @param {Object.<Webhook>} webhookObj Spark Webhook Object
     * @returns {Promise.<Webhook>} Spark Webhook Object
     *
     * @example
     * spark.webhookGet(Tm90aGluZyB0byBzZWUgaGVy)
     *   .then((webhook) => {
     *     webhook.name = 'Another Webhook';
     *     return spark.webhookUpdate(webhook);
     *   })
     *   .then(webhook => console.log(webhook.name))
     *   .catch(err => console.error(err));
     */
    webhookUpdate: (webhookObj) => {
      // if webhook object is valid
      if (webhookObj && typeof webhookObj === 'object' && validator.isWebhook(webhookObj)) {
        // update the webhook
        return Spark.request('put', 'webhooks', webhookObj.id, webhookObj);
      }
      return when.reject(new Error('invalid or missing webhook object'));
    },

    /**
     * @description Remove Spark Webhook by ID.
     *
     * @memberof Spark
     * @function
     * @param {String} webhookId Spark Webhook ID.
     * @returns {Promise} Fulfilled promise
     *
     * @example
     * spark.webhookRemove('Tm90aGluZyB0byBzZWUgaGVy')
     *   .then(() => console.log('Webhook removed.'))
     *   .catch(err => console.error(err));
     */
    webhookRemove: (webhookId) => {
      if (typeof webhookId !== 'string') {
        return when.reject(new Error('invalid arguments'));
      }
      return Spark.request('delete', 'webhooks', webhookId);
    },

    /**
     * @description Authenticate X-Spark-Signature HMAC-SHA1 Hash.
     *
     * @memberof Spark
     * @function
     * @param {String} secret Value of secret used when creating webhook
     * @param {String} signature Value of "X-Spark-Signature" from header
     * @param {(String|Object)} payload This can either be the json object or
     * a string representation of the webhook's body json payload
     * @returns {Promise.String|Object} payload
     *
     * @example
     * const sig = req.headers['x-spark-signature'];
     * const secret = 'mySecret';
     *
     * spark.webhookAuth(secret, sig, req.body)
     *   .then(() => console.log('Webhook is valid');
     *   .catch(err => console.error(err));
     */
    webhookAuth: (secret, signature, payload) => {
      let strPayload;
      if (typeof payload === 'object') {
        strPayload = jsonStringify(payload);
      } else if (typeof payload === 'string') {
        strPayload = when(payload);
      } else {
        return when.reject(new Error('invalid payload'));
      }

      if (typeof signature === 'string' && typeof secret === 'string') {
        const hmac = crypto.createHmac('sha1', secret);

        return strPayload.then((pl) => {
          hmac.update(pl);
          if (cryptoTimingSafeEqualStr(signature, hmac.digest('hex'))) {
            return when(payload);
          }
          return when.reject(new Error('received an invalid payload'));
        });
      }
      return when.reject(new Error('received a request with missing or invalid function arguments'));
    },

    /**
     * @description Process request from connect, express, or resitify routes.
     * Returns function that accepts req, res, and next arguments.
     *
     * @memberof Spark
     * @returns {Spark.webhookListen~webhookHandler} function
     *
     * @example
     * const Spark = require('node-sparky');
     * const express = require('express');
     * const bodyParser = require('body-parser');
     * const when = require('when');
     *
     * const spark = new Spark({
     *   token: '<my token>',
     *   webhookSecret: 'somesecr3t',
     * });
     *
     * const port = parseInt(process.env.PORT || '3000', 10);
     *
     * // add events
     * spark.on('messages-created', msg => console.log(`${msg.personEmail} said: ${msg.text}`));
     *
     * const app = express();
     * app.use(bodyParser.json());
     *
     * // add route for path that is listening for web hooks
     * app.post('/webhook', spark.webhookListen());
     *
     * // start express server
     * app.listen(port, function() {
     *   // get exisiting webhooks
     *   spark.webhooksGet()
     *     // remove all existing webhooks
     *     .then(webhooks => when.map(webhooks, webhook => spark.webhookRemove(webhook.id)))
     *     // create spark webhook directed back to the externally accessible
     *     // express route defined above.
     *     .then(() => spark.webhookAdd({
     *       name: 'my webhook',
     *       targetUrl: 'https://example.com/webhook',
     *       resource: 'all',
     *       event: 'all',
     *     });
     *   console.log(`Listening on port ${port}`);
     * });
     */
    webhookListen: () => {
      /**
       * @description Function returned by spark.webhookListen()
       *
       * @param {Object} req request object
       * @param {Object} [res] response object
       * @param {Function} [next] next function
       * @returns {Null} null value
       */
      const webhookHandler = (req, res, next) => {
        // always respond OK if res is defined
        if (typeof res !== 'undefined') {
          res.status(200);
          res.send('OK');
        }

        // process webhook body object
        const processBody = (bodyObj) => {
          const resource = _.has(bodyObj, 'resource') ? bodyObj.resource.toLowerCase() : false;
          const event = _.has(bodyObj, 'event') ? bodyObj.event.toLowerCase() : false;
          const data = _.has(bodyObj, 'data') ? bodyObj.data : false;

          if (resource && event && data) {
            /**
             * @description Webhook membership event
             *
             * @event memberships
             * @type object
             * @property {String} event Triggered event (created, updated, deleted)
             * @property {Object.<Membership>} membership Membership Object found in Webhook
             * @property {Object.<RequestBody>} reqBody Full Webhook Body Object
             */

            /**
             * @description Webhook messages event
             *
             * @event messages
             * @type object
             * @property {String} event Triggered event (created, deleted)
             * @property {Object.<Message>} message Message Object found in Webhook
             * @property {Object.<RequestBody>} reqBody Full Webhook Body Object
             */

            /**
             * @description Webhook rooms event
             *
             * @event rooms
             * @type object
             * @property {String} event Triggered event (created, updated)
             * @property {Object.<Room>} room Room Object found in Webhook
             * @property {Object.<RequestBody>} reqBody Full Webhook Body Object
             */

            /**
             * @description Webhook Memberships Created event
             *
             * @event memberships-created
             * @type object
             * @property {Object.<Membership>} membership Membership Object found in Webhook
             * @property {Object.<RequestBody>} reqBody Full Webhook Body Object
             */

            /**
             * @description Webhook Memberships Updated event
             *
             * @event memberships-updated
             * @type object
             * @property {Object.<Membership>} membership Membership Object found in Webhook
             * @property {Object.<RequestBody>} reqBody Full Webhook Body Object
             */

            /**
             * @description Webhook Memberships Deleted event
             *
             * @event memberships-deleted
             * @type object
             * @property {Object.<Membership>} membership Membership Object found in Webhook
             * @property {Object.<RequestBody>} reqBody Full Webhook Body Object
             */

            /**
             * @description Webhook Messages Created event
             *
             * @event messages-created
             * @type object
             * @property {Object.<Message>} message Message Object found in Webhook
             * @property {Object.<RequestBody>} reqBody Full Webhook Body Object
             */

            /**
             * @description Webhook Messages Deleted event
             *
             * @event messages-deleted
             * @type object
             * @property {Object.<Message>} message Message Object found in Webhook
             * @property {Object.<RequestBody>} reqBody Full Webhook Body Object
             */

            /**
             * @description Webhook Rooms Created event
             *
             * @event rooms-created
             * @type object
             * @property {Object.<Room>} message Room Object found in Webhook
             * @property {Object.<RequestBody>} reqBody Full Webhook Body Object
             */

            /**
             * @description Webhook Rooms Updated event
             *
             * @event rooms-updated
             * @type object
             * @property {Object.<Room>} message Room Object found in Webhook
             * @property {Object.<RequestBody>} reqBody Full Webhook Body Object
             */

            if (resource === 'messages' && event === 'created') {
              Spark.messageGet(data.id)
                .then((messageFull) => {
                  Spark.emit(resource, event, messageFull, bodyObj);
                  Spark.emit(`${resource}-${event}`, messageFull, bodyObj);
                })
                .catch(err => debug(err));
            } else {
              Spark.emit(resource, event, data, bodyObj);
              Spark.emit(`${resource}-${event}`, data, bodyObj);
            }

            /**
             * @description Webhook request event
             *
             * @event request
             * @type object
             * @property {Object.<RequestBody>} reqBody Full Webhook Body Object
             */

            Spark.emit('request', bodyObj);
          }
        };

        // validate "req"
        if (req && typeof req === 'object' && _.has(req, 'headers') && _.has(req, Spark.webhookReqNamespace)) {
          // headers
          const headers = req.headers;

          // body
          let body = {};
          // if body data type is object
          if (typeof req[Spark.webhookReqNamespace] === 'object') {
            body = when(req[Spark.webhookReqNamespace]);
          } else if (typeof req[Spark.webhookReqNamespace] === 'string') {
            body = jsonParse(req[Spark.webhookReqNamespace]);
          }

          // hmac signature
          const sig = _.has(headers, 'x-spark-signature') ? headers['x-spark-signature'] : false;

          if (sig && Spark.webhookSecret) {
            when(body)
              .then(bodyObj => Spark.webhookAuth(Spark.webhookSecret, sig, bodyObj))
              .then(bodyObj => when(processBody(bodyObj)))
              .catch(err => debug(err));
          } else if (xor(sig, Spark.webhookSecret)) {
            const secretSigErr = new Error('webhookListen ignored callback due to inconsistent webhook signature or secret');
            debug(secretSigErr);
          } else {
            when(body)
              .then(bodyObj => when(processBody(bodyObj)))
              .catch(err => debug(err));
          }
        } else {
          const invalidWebhookErr = new Error('invalid webhook received');
          debug(invalidWebhookErr);
        }
      };

      return webhookHandler;
    },
  };

  return webhooks;
};

module.exports = Webhooks;
