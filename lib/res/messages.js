'use strict';

const when = require('when');
const _ = require('lodash');

const validator = require('../validator');

/**
 * Message Object
 *
 * @namespace Message
 * @property {String} id - Message ID
 * @property {String} roomId - Room ID
 * @property {String} roomType - Room Type
 * @property {String} toPersonId - Person ID
 * @property {String} toPersonEmail - Person Email
 * @property {String} text - Message text
 * @property {String} markdown - Message markdown
 * @property {Array.<String>} files - Array of File URLs
 * @property {String} personId - Person ID
 * @property {String} personEmail - Person Email
 * @property {String} created - Date Message created (ISO 8601)
 * @property {Array.String} mentionedPeople - Person IDs of those mentioned in Message
 */

module.exports = function(Spark) {
  /**
   * Returns Spark Message Objects. If 'max' is not specifed, returns all.
   *
   * @function
   * @param {Object} messageSearch - Spark Message Search Object
   * @param {Integer} [max] - Number of records to return (optional)
   * @returns {Promise.Array.<Message>} Message Collection
   *
   * @example
   * spark.messagesGet({roomId: 'Tm90aGluZyB0byBzZWUgaGVyZS4uLiBNb3ZlIGFsb25nLi4u'}, 100)
   *   .then(function(messages) {
   *     // process messages as array
   *     messages.forEach(function(message) {
   *       console.log(message.text);
   *     });
   *   })
   *   .catch(function(err) {
   *     // process error
   *     console.log(err);
   *   });
   */
  Spark.messagesGet = function(messageSearch, maxResults) {
    let args = Array.prototype.slice.call(arguments);
    messageSearch = args.length > 0 && typeof args[0] === 'object' ? args.shift() : {};
    maxResults = args.length > 0 && typeof args[0] === 'number' ? args.shift() : undefined;

    if(!validator.isMessageSearch(messageSearch)) {
      return when.reject(new Error('invalid search'));
    }

    else {
      messageSearch.max = Spark.maxPageItems;
      return Spark.request('get', 'rooms', messageSearch, maxResults);
    }
  };

  /**
   * Return details of Spark Message by ID.
   *
   * @function
   * @param {String} messageId - Spark Message ID
   * @returns {Promise.<Message>} Message
   *
   * @example
   * spark.messageGet('Tm90aGluZyB0byBzZWUgaGVyZS4uLiBNb3ZlIGFsb25nLi4u', 100)
   *   .then(function(message) {
   *     console.log(message.text);
   *   })
   *   .catch(function(err) {
   *     // process error
   *     console.log(err);
   *   });
   */
  Spark.messageGet = function(messageId) {
    return Spark.request('get', 'messages', messageId);
  };

  /**
   * Send Spark Message.
   *
   * @function
   * @param {Object.<MessageAdd>} message - Spark Message Add Object
   * @param {Object.<File>} [file] - File Object to add to message (optional)
   * @returns {Promise.<Message>} Message
   *
   * @example
   * let newMessage = {
   *   roomId: 'Tm90aGluZyB0byBzZWUgaGVyZS4uLiBNb3ZlIGFsb25nLi4u',
   *   text: 'Hello World'
   * };
   *
   * spark.contentCreate('/some/file/with.ext')
   *   .then(function(file) {
   *     return spark.messageSend(newMessage, file);
   *   })
   *   .then(function(message) {
   *     console.log(message.id);
   *   })
   *   .catch(function(err) {
   *     // process error
   *     console.log(err);
   *   });
   */
  Spark.messageSend = function(message, file) {
    let isMessage = (message && typeof message === 'object' && validator.isMessage(message));
    let isFile = (file && typeof file === 'object' && validator.isFile(file));

    // if file object not passed, add message through REST API
    if(isMessage && !file) {
      return Spark.request('post', 'messages', message);
    }

    // else, add message through formData API
    else if(isMessage && isFile) {
      // verify apiUrl and token is defined (should never hit this... but yay testing!)
      if(!Spark.apiUrl || !Spark.token) {
        return when.reject(new Error('invalid or missing spark options'));
      } else {

        let formData = message;

        // add file to formData
        formData.files = [{
          value: file.binary,
          options: {
            filename: file.name,
            contentType: file.type
          }
        }];

        return Spark.request('form', 'messages', formData);
      }
    }

    // else, invalid arguments
    else {
      return when.reject(new Error('invalid or missing arguments'));
    }
  };

  // alias for messageSend()
  Spark.messageAdd = function(message, file) {
    return Spark.messageSend(message, file);
  };

  /**
   * Remove Spark Message by ID.
   *
   * @function
   * @param {String} messageId - Spark Message ID
   * @returns {Promise} message
   *
   * @example
   * spark.messageRemove('Tm90aGluZyB0byBzZWUgaGVyZS4uLiBNb3ZlIGFsb25nLi4u')
   *   .then(function() {
   *     console.log('Message removed.');
   *   })
   *   .catch(function(err){
   *     console.log(err);
   *   });
   */
  Spark.messageRemove = function(messageId) {
    return Spark.request('delete', 'messages', messageId)
      .then(res => when(true));
  };

  // return the Spark Object
  return Spark;
};
