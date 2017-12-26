const moment = require('moment');
const when = require('when');
const _ = require('lodash');
const validator = require('../validator');

/**
 * @description Message Object
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

const Messages = (Spark) => {
  const messages = {
    /**
     * @description Returns Spark Message Objects. If 'max' is not specifed, returns all.
     *
     * @memberof Spark
     * @function
     * @param {Object} messageSearch Spark Message Search Object
     * @param {Integer} [max] Number of records to return (optional)
     * @returns {Promise.Array.<Message>} Array of Spark Message objects
     *
     * @example
     * spark.messagesGet({roomId: 'Tm90aGluZyB0byBzZWUgaGVy'}, 100)
     *   .then(messages => messages.forEach(message => console.log(message.text)))
     *   .catch(err => console.error(err));
     */
    messagesGet: (...args) => {
      const messageSearch = args.length > 0 && typeof args[0] === 'object' ? args.shift() : {};
      const maxResults = args.length > 0 && typeof args[0] === 'number' ? args.shift() : 0;

      if (!validator.isMessageSearch(messageSearch)) {
        return when.reject(new Error('invalid search'));
      }

      messageSearch.max = Spark.maxPageItems;

      // check for after property
      if (_.has(messageSearch, 'after')) {
        // increase max page items to reduce API calls for this action
        messageSearch.max = parseInt(Spark.maxPageItems, 10) * 10;
        // convert property 'after' from ISO 8601 string to epoch (ms)
        const afterDate = moment(messageSearch.after).valueOf();
        // remove unsupported SPark API property from request
        delete messageSearch.after;
        // return array of messages created after ISO 8601 date
        return Spark.request('get', 'messages', messageSearch, 0)
          .then((allMessages) => {
            const selectedMessages = _.filter(allMessages, (message) => {
              // convert property 'created' from ISO 8601 string to epoch (ms)
              const createdDate = moment(message.created).valueOf();
              // return only results where created date ms is greater than after date ms
              return (createdDate > afterDate);
            });
            return when(selectedMessages);
          });
      }

      return Spark.request('get', 'messages', messageSearch, maxResults);
    },

    /**
     * @description Return details of Spark Message by ID.
     *
     * @memberof Spark
     * @function
     * @param {String} messageId Spark Message ID
     * @returns {Promise.<Message>} Spark Message object
     *
     * @example
     * spark.messageGet('Tm90aGluZyB0byBzZWUgaGVy')
     *   .then(message => console.log(message.text))
     *   .catch(err => console.error(err));
     */
    messageGet: (messageId) => {
      if (typeof messageId !== 'string') {
        return when.reject(new Error('invalid arguments'));
      }
      return Spark.request('get', 'messages', messageId);
    },

    /**
     * @description Send Spark Message.
     *
     * @memberof Spark
     * @function
     * @param {Object.<MessageAdd>} message Spark Message Add Object
     * @param {Object.<File>} [file] File Object to add to message (optional)
     * @returns {Promise.<Message>} Spark Message object
     *
     * @example
     * const newMessage = {
     *   roomId: 'Tm90aGluZyB0byBzZWUgaGVy',
     *   text: 'Hello World'
     * };
     *
     * spark.contentCreate('/some/file/with.ext')
     *   .then(file => spark.messageSend(newMessage, file))
     *   .then(message => console.log(message.id))
     *   .catch(err => console.error(err));
     */
    messageSend: (message, file) => {
      const isMessage = (message && typeof message === 'object' && validator.isMessage(message));
      const isFile = (file && typeof file === 'object' && validator.isFile(file));

      // if file object not passed, add message through REST API
      if (isMessage && !file) {
        return Spark.request('post', 'messages', message);
      }

      if (isMessage && isFile) {
        // verify apiUrl and token is defined (should never hit this... but yay testing!)
        if (!Spark.apiUrl || !Spark.token) {
          return when.reject(new Error('invalid or missing spark options'));
        }
        const formData = message;

        // add file to formData
        formData.files = [{
          value: file.binary,
          options: {
            filename: file.name,
            contentType: file.type,
          },
        }];

        return Spark.request('form', 'messages', formData);
      }

      return when.reject(new Error('invalid or missing arguments'));
    },

    /**
     * @description Remove Spark Message by ID.
     *
     * @memberof Spark
     * @function
     * @param {String} messageId Spark Message ID
     * @returns {Promise} Fulfilled promise
     *
     * @example
     * spark.messageRemove('Tm90aGluZyB0byBzZWUgaGVy')
     *   .then(() => console.log('Message removed.'))
     *   .catch(err => console.error(err));
     */
    messageRemove: (messageId) => {
      if (typeof messageId !== 'string') {
        return when.reject(new Error('invalid arguments'));
      }
      return Spark.request('delete', 'messages', messageId);
    },
  };

  return messages;
};

module.exports = Messages;
