'use strict';

const node = require('when/node');
const when = require('when');
const fs = require('fs');
const _ = require('lodash');

const fsStat = node.lift(fs.stat);

/**
 * Spark Object Validation
 *
 * @name Validator
 * @namespace Validator
 */
const Validator = {};

/**
 * Validate filePath resolves to existing file. Returns fulfilled Promise with
 * filePath if valid, else returns rejected Promise if not valid.
 *
 * @function
 * @memberof Validator
 * @param {String} filePath
 * @returns {Promise.String} filePath
 */
Validator.isFile = function(filePath) {
  return fsStat(filePath)
    .then(stats => {
      if(stats.isFile()) {
        return when(filePath);
      } else {
        return when.reject(new Error('file not found or is a reference to a directory'));
      }
    });
};

/**
 *Validate filePath resolves to existing file. Returns fulfilled Promise with
 * dirPath if valid, else returns rejected Promise if not valid.
 *
 * @function
 * @memberof Validator
 * @param {String} dirPath
 * @returns {Promise.String} dirPath
 */
Validator.isDir = function(dirPath) {
  return fsStat(dirPath)
    .then(stats => {
      if(stats.isDir()) {
        return when(dirPath);
      } else {
        return when.reject(new Error('dir not found or is a reference to a file'));
      }
    });
};

/**
 * Validate Spark Token is valid by sending request to API to determine if
 * authorized. Returns fulfilled Promise with token if valid, else returns rejected
 * Promise if not valid.
 *
 * @function
 * @memberof Validator
 * @param {String} token
 * @returns {Promise.String} Token
 */
Validator.isToken = function(token) {
  if(!token) {
    return when.reject(new Error('invalid token'));
  } else {
    let Spark = require('./spark.js');
    let spark = new Spark({token: token});

    return spark.personMe()
      .then(person => {
        if(Validator.isPerson) {
          return when(token);
        } else {
          return when.reject(new Error('invalid token'));
        }
      })
      .catch(err => {
        return when.reject(new Error('invalid token'));
      });
  }
};

/**
 * Validate String is Email.
 *
 * @function
 * @memberof Validator
 * @param {String} email
 * @returns {Boolean}
 */
Validator.isEmail = function(email) {
  if(typeof email !== 'string') {
    return false;
  }

  email = _.toLower(email);

  let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  return re.test(email);
};

/**
 * Validate Emails in Array.
 *
 * @function
 * @memberof Validator
 * @param {Array} emails
 * @returns {Boolean}
 */
Validator.isEmails = function(emails) {
 if(emails instanceof Array) {
   return _.every(emails, Validator.isEmail);
 } else {
   return false;
 }
};

/**
 * Validate String is URL.
 *
 * @function
 * @memberof Validator
 * @param {String} url
 * @returns {Boolean}
 */
Validator.isUrl = function(url) {
  if(typeof url !== 'string') {
    return false;
  } else {
    let re = /((https?):\/\/)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}([-a-zA-Z0-9@:%_\+.~#?&\/\/=]*)/;
    return re.test(url);
  }
};

/**
 * Validate String is File path.
 *
 * @function
 * @memberof Validator
 * @param {String} path
 * @returns {Boolean}
 */
Validator.isFilePath = function(path) {
  if(typeof path !== 'string') {
    return false;
  } else {
    let re = /^(?!(https?:\/))(\/?)[ -~]*/;
    return re.test(path);
  }
};

/**
 * Validate File object
 *
 * @function
 * @memberof Validator
 * @param {Object.<File>} file
 * @returns {Boolean}
 */
Validator.isFile = function(file) {
  let result = (typeof file === 'object'
    && file.name
    && file.ext
    && file.type
    && file.binary
    && file.base64
  );
  return result;
};

/**
 * Validate Spark License Object.
 *
 * @function
 * @memberof Validator
 * @param {License} object
 * @returns {Boolean}
 */
Validator.isLicense = function(license) {
  let result = (typeof license === 'object'
    && license.id
    && license.name
  );
  return result;
};

/**
 * Validate Spark License Objects in Array.
 *
 * @function
 * @memberof Validator
 * @param {Array} licenses
 * @returns {Boolean}
 */
Validator.isLicenses = function(licenses) {
  if(licenses instanceof Array) {
    return _.every(licenses, Validator.isLicense);
  } else {
    return false;
  }
};

/**
 * Validate Spark Membership Object.
 *
 * @function
 * @memberof Validator
 * @param {Membership} object
 * @returns {Boolean}
 */
Validator.isMembership = function(membership) {
  let result = (typeof membership === 'object'
    && membership.roomId
    && membership.personId
    && membership.personEmail
  );
  return result;
};

/**
 * Validate Spark Membership Objects in Array.
 *
 * @function
 * @memberof Validator
 * @param {Array} memberships
 * @returns {Boolean}
 */
Validator.isMemberships = function(memberships) {
  if(memberships instanceof Array) {
    return _.every(memberships, Validator.isMembership);
  } else {
    return false;
  }
};

/**
 * Validate Spark Membership Search Object.
 *
 * @function
 * @memberof Validator
 * @param {MembershipSearch} object
 * @returns {Boolean}
 */
Validator.isMembershipSearch = function(membershipSearch) {
  membershipSearch = (typeof membershipSearch === 'object') ? membershipSearch : {};

  let searchByRoomId = (membershipSearch.roomId && !membershipSearch.personId && !membershipSearch.personEmail);
  let searchByPersonId = (membershipSearch.roomId && membershipSearch.personId);
  let searchByPersonEmail = (membershipSearch.roomId && membershipSearch.personEmail);

  let result = (searchByRoomId || searchByPersonId || searchByPersonEmail);
  return result;
};

/**
 * Validate Spark Message Object.
 *
 * @function
 * @memberof Validator
 * @param {Message} object
 * @returns {Boolean}
 */
Validator.isMessage = function(message) {
  message = (typeof message === 'object') ? message : {};

  let directMessage = (message.toPersonId || message.toPersonEmail);
  let groupMessage = (!directMessage && message.roomId);

  let result = ((directMessage || groupMessage)
    && (message.text || message.markdown || message.files));
  return result;
};

/**
 * Validate Spark Message Objects in Array.
 *
 * @function
 * @memberof Validator
 * @param {Array} messages
 * @returns {Boolean}
 */
Validator.isMessages = function(messages) {
  if(messages instanceof Array) {
    return _.every(messages, Validator.isMessage);
  } else {
    return false;
  }
};

/**
 * Validate Spark Message Search Object.
 *
 * @function
 * @memberof Validator
 * @param {MessageSearch} object
 * @returns {Boolean}
 */
Validator.isMessageSearch = function(messageSearch) {
  let result = (typeof messageSearch === 'object'
    && (messageSearch.roomId || (messageSearch.roomId && (messageSearch.mentionedPeople || messageSearch.before || messageSearch.beforeMessage)))
  );
  return result;
};

/**
 * Validate Spark Organization Object.
 *
 * @function
 * @memberof Validator
 * @param {Organization} object
 * @returns {Boolean}
 */
Validator.isOrganization = function(organization) {
  let result = (typeof organization === 'object'
    && organization.id
    && organization.displayName
  );
  return result;
};

/**
 * Validate Spark Organizations Objects in Array.
 *
 * @function
 * @memberof Validator
 * @param {Array} organizations
 * @returns {Boolean}
 */
Validator.isOrganizations = function(organizations) {
  if(organizations instanceof Array) {
    return _.every(organizations, Validator.isOrganization);
  } else {
    return false;
  }
};

/**
 * Validate Spark Person Object.
 *
 * @function
 * @memberof Validator
 * @param {Room} object
 * @returns {Boolean}
 */
Validator.isPerson = function(person) {
  let result = (typeof person === 'object'
    && person.displayName
    && person.firstName
    && person.lastName
    && person.emails
  );
  return result;
};

/**
 * Validate Spark Person Objects in Array.
 *
 * @function
 * @memberof Validator
 * @param {Array} persons
 * @returns {Boolean}
 */
Validator.isPeople = function(people) {
  if(people instanceof Array) {
    return _.every(people, Validator.isPerson);
  } else {
    return false;
  }
};

/**
 * Validate Spark Person Search Object.
 *
 * @function
 * @memberof Validator
 * @param {PersonSearch} object
 * @returns {Boolean}
 */
Validator.isPersonSearch = function(personSearch) {
  let result = (typeof personSearch === 'object'
    && (personSearch.id || personSearch.displayName || personSearch.email)
  );
  return result;
};

/**
 * Validate Spark Role Object.
 *
 * @function
 * @memberof Validator
 * @param {Role} object
 * @returns {Boolean}
 */
Validator.isRole = function(role) {
  let result = (typeof role === 'object'
    && role.id
    && role.name
  );
  return result;
};

/**
 * Validate Spark Role Objects in Array.
 *
 * @function
 * @memberof Validator
 * @param {Array} roles
 * @returns {Boolean}
 */
Validator.isRoles = function(roles) {
  if(roles instanceof Array) {
    return _.every(roles, Validator.isRole);
  } else {
    return false;
  }
};

/**
 * Validate Spark Room Object.
 *
 * @function
 * @memberof Validator
 * @param {Room} object
 * @returns {Boolean}
 */
Validator.isRoom = function(room) {
  let result = (typeof room === 'object'
    && room.id
    && room.hasOwnProperty('title')
    && room.type
  );
  return result;
};

/**
 * Validate Spark Room Objects in Array.
 *
 * @function
 * @memberof Validator
 * @param {Array} rooms
 * @returns {Boolean}
 */
Validator.isRooms = function(rooms) {
  if(rooms instanceof Array) {
    return _.every(rooms, Validator.isRoom);
  } else {
    return false;
  }
};

/**
 * Validate Spark Room Search Object.
 *
 * @function
 * @memberof Validator
 * @param {RoomSearch} object
 * @returns {Boolean}
 */
Validator.isRoomSearch = function(roomSearch) {
  let result = (typeof roomSearch === 'object'
    && (roomSearch.teamId || roomSearch.type)
  );
  return result;
};

/**
 * Validate Spark Team Object.
 *
 * @function
 * @memberof Validator
 * @param {Team} object
 * @returns {Boolean}
 */
Validator.isTeam = function(team) {
  if(team instanceof Array) team = team[0];
  let result = (typeof team === 'object'
    && team.id
    && team.name
  );
  return result;
};

/**
 * Validate Spark Team Objects in Array.
 *
 * @function
 * @memberof Validator
 * @param {Array} teams
 * @returns {Boolean}
 */
Validator.isTeams = function(teams) {
  if(teams instanceof Array) {
    return _.every(teams, Validator.isTeam);
  } else {
    return false;
  }
};

/**
 * Validate Spark Team Membership Object.
 *
 * @function
 * @memberof Validator
 * @param {TeamMembership} object
 * @returns {Boolean}
 */
Validator.isTeamMembership = function(teamMembership) {
  let result = (typeof teamMembership === 'object'
    && teamMembership.teamId
    && teamMembership.personId
    && teamMembership.personEmail
  );
  return result;
};

/**
 * Validate Spark Team Membership Objects in Array.
 *
 * @function
 * @memberof Validator
 * @param {Array} teamMemberships
 * @returns {Boolean}
 */
Validator.isTeamMemberships = function(teamMemberships) {
  if(teamMemberships instanceof Array) {
    return _.every(teamMemberships, Validator.isTeamMembership);
  } else {
    return false;
  }
};

/**
 * Validate Spark Webhook Object.
 *
 * @function
 * @memberof Validator
 * @param {Webhook} object
 * @returns {Boolean}
 */
Validator.isWebhook = function(webhook) {
  let result = (typeof webhook === 'object'
    && webhook.name
    && webhook.targetUrl
    && webhook.resource
    && webhook.event
  );
  return result;
};

/**
 * Validate Spark Webhook Objects in Array.
 *
 * @function
 * @memberof Validator
 * @param {Array} webhooks
 * @returns {Boolean}
 */
Validator.isWebhooks = function(webhooks) {
  if(webhooks instanceof Array && webhooks.length > 0) {
    return _.every(webhooks, Validator.isWebhook);
  } else {
    return (webhook instanceof Array && webhooks.length === 0);
  }
};

module.exports = Validator;
