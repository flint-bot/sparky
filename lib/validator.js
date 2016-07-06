/**
 * @file Defines Sparky Validator
 * @author Nicholas Marus <nmarus@gmail.com>
 * @license LGPL-3.0
 */

'use strict';

var _ = require('lodash');

/**
 *
 * Spark Validation functions.
 *
 * @name Validator
 * @namespace Validator
 *
 */
var Validator = {};

/**
 *
 * Validate String is Email.
 *
 * @function
 *
 * @memberof Validator
 *
 * @param {String} email
 *
 * @returns {Boolean}
 * Returns results of validation..
 *
 */
Validator.isEmail = function(email) {
  if(typeof email !== 'string') {
    return false;
  }

  email = _.toLower(email);

  var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  return re.test(email);
};

/**
 *
 * Validate String is URL.
 *
 * @function
 *
 * @memberof Validator
 *
 * @param {String} url
 *
 * @returns {Boolean}
 * Returns results of validation..
 *
 */
Validator.isUrl = function(url) {
  if(typeof url !== 'string') {
    return false;
  }

  url = _.toLower(url);

  var re = /((https?):\/\/)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}([-a-zA-Z0-9@:%_\+.~#?&\/\/=]*)/;

  return re.test(url);
};

/**
 *
 * Validate Spark Room Object.
 *
 * @function
 *
 * @memberof Validator
 *
 * @param {Room} object
 *
 * @returns {Boolean}
 * True/false result of validation.
 *
 */
Validator.isRoom = function(room) {
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
 * Validate Spark Person Object.
 *
 * @function
 *
 * @memberof Validator
 *
 * @param {Room} object
 *
 * @returns {Boolean}
 * True/false result of validation.
 *
 */
Validator.isPerson = function(person) {
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
 *
 * @memberof Validator
 *
 * @param {Message} object
 *
 * @returns {Boolean}
 * True/false result of validation.
 *
 */
Validator.isMessage = function(message) {
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
 * Validate Spark Membership Object.
 *
 * @function
 *
 * @memberof Validator
 *
 * @param {Membership} object
 *
 * @returns {Boolean}
 * True/false result of validation.
 *
 */
Validator.isMembership = function(membership) {
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
 *
 * @memberof Validator
 *
 * @param {Webhook} object
 *
 * @returns {Boolean}
 * True/false result of validation.
 *
 */
Validator.isWebhook = function(webhook) {
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
 * Validate Spark Team Object.
 *
 * @function
 *
 * @memberof Validator
 *
 * @param {Team} object
 *
 * @returns {Boolean}
 * True/false result of validation.
 *
 */
Validator.isTeam = function(team) {
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
 * Validate Spark Room Objects in Array.
 *
 * @function
 *
 * @memberof Validator
 *
 * @param {Array} rooms
 *
 * @returns {Boolean}
 * True/false result of validation.
 *
 */
Validator.isRooms = function(rooms) {
  if(rooms instanceof Array) {
    return _.every(rooms, Validator.isRoom);
  } else {
    return false;
  }
};

/**
 *
 * Validate Spark Person Objects in Array.
 *
 * @function
 *
 * @memberof Validator
 *
 * @param {Array} persons
 *
 * @returns {Boolean}
 * True/false result of validation.
 *
 */
Validator.isPeople = function(people) {
  if(people instanceof Array) {
    return _.every(people, Validator.isPerson);
  } else {
    return false;
  }
};

/**
 *
 * Validate Spark Message Objects in Array.
 *
 * @function
 *
 * @memberof Validator
 *
 * @param {Array} messages
 *
 * @returns {Boolean}
 * True/false result of validation.
 *
 */
Validator.isMessages = function(messages) {
  if(messages instanceof Array) {
    return _.every(messages, Validator.isMessage);
  } else {
    return false;
  }
};

/**
 *
 * Validate Spark Membership Objects in Array.
 *
 * @function
 *
 * @memberof Validator
 *
 * @param {Array} memberships
 *
 * @returns {Boolean}
 * True/false result of validation.
 *
 */
Validator.isMemberships = function(memberships) {
  if(memberships instanceof Array) {
    return _.every(memberships, Validator.isMembership);
  } else {
    return false;
  }
};

/**
 *
 * Validate Spark Webhook Objects in Array.
 *
 * @function
 *
 * @memberof Validator
 *
 * @param {Array} webhooks
 *
 * @returns {Boolean}
 * True/false result of validation.
 *
 */
Validator.isWebhooks = function(webhooks) {
  if(webhooks instanceof Array) {
    return _.every(webhooks, Validator.isWebhook);
  } else {
    return false;
  }
};

/**
 *
 * Validate Spark Team Objects in Array.
 *
 * @function
 *
 * @memberof Validator
 *
 * @param {Array} teams
 *
 * @returns {Boolean}
 * True/false result of validation.
 *
 */
Validator.isTeams = function(teams) {
  if(teams instanceof Array) {
    return _.every(teams, Validator.isWebhook);
  } else {
    return false;
  }
};

module.exports = Validator;
