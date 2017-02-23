'use strict';

const when = require('when');
const crypto = require('crypto');

const validator = require('../validator');

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
      return this.request('post', 'webhooks', webhook)
        .then(res => this.toObject(res));
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

  // return the Spark Object
  return Spark;
 };
