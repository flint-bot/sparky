/**
 * @file Defines Sparky Utilities
 * @author Nicholas Marus <nmarus@gmail.com>
 * @license LGPL-3.0
 */

'use strict';

var uuid = require('uuid');
var _ = require('lodash');

var Utils = {};

/**
 *
 * Base64 encode a string.
 *
 * @function
 * @private
 *
 * @param {String} string
 *
 * @returns {String}
 * Base64 encoded string.
 *
 */
Utils.base64encode = string => {
    return new Buffer(string).toString('base64');
};

/**
 *
 * Generate UUID string.
 *
 * @function
 * @private
 *
 * @returns {String}
 * UUID string.
 *
 */
Utils.genUUID = () => {
  return uuid.v4();
};

/**
 *
 * Generate a Base64 encoded UUID.
 *
 * @function
 * @private
 *
 * @returns {String}
 * Base64 encoded UUID.
 *
 */
Utils.genUUID64 = () => {
  return Utils.base64encode(Utils.genUUID());
};

Utils.isEmail = email => {
  if(typeof email !== 'string') {
    return false;
  }

  var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  return re.test(email);
};

Utils.isUrl = url => {
  if(typeof url !== 'string') {
    return false;
  }

  var re = /((ftp|https?):\/\/)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}([-a-zA-Z0-9@:%_\+.~#?&\/\/=]*)/;

  return re.test(url);
};

/**
 *
 * Validate Spark Room Object.
 *
 * @function
 * @private
 *
 * @param {Room} object
 *
 * @returns {Boolean}
 * True/false result of validation.
 *
 */
Utils.isRoom = room => {
  if(room instanceof Array) room = room[0];
  var result = (typeof room === 'object'
    && room.id
    && room.title
    && room.type
    && room.created
  );
  return result;
};

/**
 *
 * Validate Spark Room Object.
 *
 * @function
 * @private
 *
 * @param {Room} object
 *
 * @returns {Boolean}
 * True/false result of validation.
 *
 */
Utils.isPerson = person => {
  if(person instanceof Array) person = person[0];
  var result = (typeof person === 'object'
    && person.id
    && person.displayName
    && person.created
    && person.avatar
    && person.emails
  );
  return result;
};

/**
 *
 * Validate Spark Message Object.
 *
 * @function
 * @private
 *
 * @param {Message} object
 *
 * @returns {Boolean}
 * True/false result of validation.
 *
 */
Utils.isMessage = message => {
  if(message instanceof Array) message = message[0];
  var result = (typeof message === 'object'
    && message.id
    && message.personId
    && message.personEmail
    && message.created
    && (message.text || message.files)
  );
  return result;
};

/**
 *
 * Validate Spark Team Object.
 *
 * @function
 * @private
 *
 * @param {Team} object
 *
 * @returns {Boolean}
 * True/false result of validation.
 *
 */
Utils.isTeam = team => {
  if(team instanceof Array) team = team[0];
  var result = (typeof team === 'object'
    && team.id
    && team.name
    && team.created
  );
  return result;
};

/**
 *
 * Validate Spark Membership Object.
 *
 * @function
 * @private
 *
 * @param {Membership} object
 *
 * @returns {Boolean}
 * True/false result of validation.
 *
 */
Utils.isMembership = membership => {
  if(membership instanceof Array) membership = membership[0];
  var result = (typeof membership === 'object'
    && membership.id
    && membership.personId
    && membership.personEmail
    && membership.created
  );
  return result;
};

/**
 *
 * Validate Spark Webhook Object.
 *
 * @function
 * @private
 *
 * @param {Webhook} object
 *
 * @returns {Boolean}
 * True/false result of validation.
 *
 */
Utils.isWebhook = webhook => {
  if(webhook instanceof Array) webhook = webhook[0];
  var result = (typeof webhook === 'object'
    && webhook.id
    && webhook.name
    && webhook.targetUrl
    && webhook.resource
    && webhook.event
    && webhook.filter
  );
  return result;
};

 /**
 *
 * Validate Spark Room Objects in Array.
 *
 * @function
 * @private
 *
 * @param {Array} rooms
 *
 * @returns {Boolean}
 * True/false result of validation.
 *
 */
Utils.isRooms = rooms => {
  if(rooms instanceof Array) {
    return _.every(rooms, Utils.isRoom);
  } else {
    return false;
  }
};

/**
 *
 * Validate Spark Person Objects in Array.
 *
 * @function
 * @private
 *
 * @param {Array} persons
 *
 * @returns {Boolean}
 * True/false result of validation.
 *
 */
Utils.isPeople = people => {
  if(people instanceof Array) {
    return _.every(people, Utils.isPerson);
  } else {
    return false;
  }
};

/**
 *
 * Validate Spark Message Objects in Array.
 *
 * @function
 * @private
 *
 * @param {Array} messages
 *
 * @returns {Boolean}
 * True/false result of validation.
 *
 */
Utils.isMessages = messages => {
  if(messages instanceof Array) {
    return _.every(messages, Utils.isMessage);
  } else {
    return false;
  }
};

/**
 *
 * Validate Spark Membership Objects in Array.
 *
 * @function
 * @private
 *
 * @param {Array} memberships
 *
 * @returns {Boolean}
 * True/false result of validation.
 *
 */
Utils.isMemberships = memberships => {
  if(memberships instanceof Array) {
    return _.every(memberships, Utils.isMembership);
  } else {
    return false;
  }
};

/**
 *
 * Validate Spark Webhook Objects in Array.
 *
 * @function
 * @private
 *
 * @param {Array} webhooks
 *
 * @returns {Boolean}
 * True/false result of validation.
 *
 */
Utils.isWebhooks = webhooks => {
  if(webhooks instanceof Array) {
    return _.every(webhooks, Utils.isWebhook);
  } else {
    return false;
  }
};

module.exports = Utils;
