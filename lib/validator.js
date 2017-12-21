const validator = require('validator');
const node = require('when/node');
const when = require('when');
const fs = require('fs');
const _ = require('lodash');

const fsp = node.liftAll(fs);

/**
 * @description Spark Object Validation
 *
 * @name Validator
 * @namespace Validator
 */
const Validator = {};

/**
 * @description Validate filePath resolves to existing file. Returns fulfilled Promise with
 * filePath if valid, else returns rejected Promise if not valid.
 *
 * @function
 * @memberof Validator
 * @param {String} filePath Absolute path to file
 * @returns {Promise.String} Absolute path to file
 */
Validator.isFile = filePath => fsp.stat(filePath)
  .then((stats) => {
    if (stats.isFile()) {
      return when(filePath);
    }
    return when.reject(new Error('file not found or is a reference to a directory'));
  });

/**
 * @description Validate filePath resolves to existing dir. Returns fulfilled Promise with
 * dirPath if valid, else returns rejected Promise if not valid.
 *
 * @function
 * @memberof Validator
 * @param {String} dirPath Absolute path to a directory
 * @returns {Promise.String} Absolute path to a directory
 */
Validator.isDir = dirPath => fsp.stat(dirPath)
  .then((stats) => {
    if (stats.isDir()) {
      return when(dirPath);
    }
    return when.reject(new Error('dir not found or is a reference to a file'));
  });

/**
 * @description Validate Spark Token is valid by sending request to API to determine if
 * authorized. Returns fulfilled Promise with token if valid, else returns rejected
 * Promise if not valid.
 *
 * @function
 * @memberof Validator
 * @param {String} token Cisco Spark Token
 * @returns {Promise.String} Cisco Spark Token
 */
Validator.isToken = (token) => {
  if (!token) {
    return when.reject(new Error('invalid token'));
  }
  const Spark = require('./spark'); // eslint-disable-line global-require
  const spark = new Spark({ token });

  return spark.personMe()
    .then((person) => {
      if (Validator.isPerson) {
        return when(token);
      }
      return when.reject(new Error('invalid token'));
    })
    .catch(err => when.reject(new Error('invalid token')));
};

/**
 * @description Validate String is Email.
 *
 * @function
 * @memberof Validator
 * @param {String} email Email address string
 * @returns {Boolean} result
 */
Validator.isEmail = (email) => {
  if (typeof email !== 'string') {
    return false;
  }

  return validator.isEmail(email);
};

/**
 * @description Validate Emails in Array.
 *
 * @function
 * @memberof Validator
 * @param {Array} emails Array of Email address string
 * @returns {Boolean} result
 */
Validator.isEmails = (emails) => {
  if (emails instanceof Array) {
    return _.every(emails, Validator.isEmail);
  }
  return false;
};

/**
 * @description Validate String is URL.
 *
 * @function
 * @memberof Validator
 * @param {String} url URL String
 * @returns {Boolean} result
 */
Validator.isUrl = (url) => {
  if (typeof url !== 'string') {
    return false;
  }
  return validator.isURL(url, { protocols: ['http', 'https'], allow_underscores: true });
};

/**
 * @description Validate String is File path and not a URL/URI.
 *
 * @function
 * @memberof Validator
 * @param {String} path String to test
 * @returns {Boolean} result
 */
Validator.isFilePath = (path) => {
  if (typeof path !== 'string') {
    return false;
  }
  const re = /^(?!(.*:\/))(\/?)[ -~]*/;
  return re.test(path);
};

/**
 * @description Validate Options object
 *
 * @function
 * @memberof Validator
 * @param {Object.<Options>} options Validate that object passed includes all
 * valid options for sparky constructor
 * @returns {Boolean} result
 */
Validator.isOptions = options => (typeof options === 'object'); // TODO

/**
 * @description Validate File object
 *
 * @function
 * @memberof Validator
 * @param {Object.<File>} file Validate that object passed includes all valid
 * options required in a file object
 * @returns {Boolean} result
 */
Validator.isFile = (file) => {
  const result = (typeof file === 'object'
    && file.name
    && file.ext
    && file.type
    && file.binary
    && file.base64
  );
  return result;
};

/**
 * @description Validate Spark Event Object.
 *
 * @function
 * @memberof Validator
 * @param {Event} event Event object
 * @returns {Boolean} result
 */
Validator.isEvent = (event) => {
  const result = (typeof event === 'object'
    && event.id
    && event.resource
    && event.type
    && event.actorId
    && event.created
    && event.data && typeof event.data === 'object'
  );
  return result;
};

/**
 * @description Validate Spark Event Objects in Array.
 *
 * @function
 * @memberof Validator
 * @param {Array} events Array of Event objects
 * @returns {Boolean} result
 */
Validator.isEvents = (events) => {
  if (events instanceof Array) {
    return _.every(events, Validator.isEvent);
  }
  return false;
};

/**
 * @description Validate Spark Event Search Object.
 *
 * @function
 * @memberof Validator
 * @param {EventSearch} searchObj EventSearch object
 * @returns {Boolean} result
 */
Validator.isEventSearch = (searchObj) => {
  if (typeof searchObj !== 'object') {
    return false;
  }
  return true;
};

/**
 * @description Validate Spark License Object.
 *
 * @function
 * @memberof Validator
 * @param {License} license License object
 * @returns {Boolean} result
 */
Validator.isLicense = (license) => {
  const result = (typeof license === 'object'
    && license.id
    && license.name
  );
  return result;
};

/**
 * @description Validate Spark License Objects in Array.
 *
 * @function
 * @memberof Validator
 * @param {Array} licenses Array of License objects
 * @returns {Boolean} result
 */
Validator.isLicenses = (licenses) => {
  if (licenses instanceof Array) {
    return _.every(licenses, Validator.isLicense);
  }
  return false;
};

/**
 * @description Validate Spark License Search Object.
 *
 * @function
 * @memberof Validator
 * @param {LicenseSearch} searchObj LicenseSearch object
 * @returns {Boolean} result
 */
Validator.isLicenseSearch = (searchObj) => {
  if (typeof searchObj !== 'object') {
    return false;
  }
  return true;
};

/**
 * @description Validate Spark Membership Object.
 *
 * @function
 * @memberof Validator
 * @param {Membership} membership Membership object
 * @returns {Boolean} result
 */
Validator.isMembership = (membership) => {
  const result = (typeof membership === 'object'
    && membership.roomId
    && membership.personId
    && membership.personEmail
  );
  return result;
};

/**
 * @description Validate Spark Membership Objects in Array.
 *
 * @function
 * @memberof Validator
 * @param {Array} memberships Array of Membership objects
 * @returns {Boolean} result
 */
Validator.isMemberships = (memberships) => {
  if (memberships instanceof Array) {
    return _.every(memberships, Validator.isMembership);
  }
  return false;
};

/**
 * @description Validate Spark Membership Search Object.
 *
 * @function
 * @memberof Validator
 * @param {MembershipSearch} searchObj MembershipSearch object
 * @returns {Boolean} result
 */
Validator.isMembershipSearch = (searchObj) => {
  if (typeof searchObj !== 'object') {
    return false;
  }

  const searchByRoomId = (searchObj.roomId && !searchObj.personId && !searchObj.personEmail);
  const searchByPersonId = (searchObj.roomId && searchObj.personId);
  const searchByPersonEmail = (searchObj.roomId && searchObj.personEmail);

  return (searchByRoomId || searchByPersonId || searchByPersonEmail);
};

/**
 * @description Validate Spark Message Object.
 *
 * @function
 * @memberof Validator
 * @param {Message} message Message object
 * @returns {Boolean} result
 */
Validator.isMessage = (message) => {
  if (typeof message !== 'object') {
    return false;
  }

  const directMessage = (message.toPersonId || message.toPersonEmail);
  const groupMessage = (!directMessage && message.roomId);

  const result = ((directMessage || groupMessage)
    && (message.text || message.markdown || message.files));
  return result;
};

/**
 * @description Validate Spark Message Objects in Array.
 *
 * @function
 * @memberof Validator
 * @param {Array} messages Array of Message objects
 * @returns {Boolean} result
 */
Validator.isMessages = (messages) => {
  if (messages instanceof Array) {
    return _.every(messages, Validator.isMessage);
  }
  return false;
};

/**
 * @description Validate Spark Message Search Object.
 *
 * @function
 * @memberof Validator
 * @param {MessageSearch} searchObj MessageSearch object
 * @returns {Boolean} result
 */
Validator.isMessageSearch = searchObj => (typeof searchObj === 'object' && searchObj.roomId);

/**
 * @description Validate Spark Organization Object.
 *
 * @function
 * @memberof Validator
 * @param {Organization} organization Organization object
 * @returns {Boolean} result
 */
Validator.isOrganization = organization => (typeof organization === 'object' && organization.id && organization.displayName);

/**
 * @description Validate Spark Organizations Objects in Array.
 *
 * @function
 * @memberof Validator
 * @param {Array} organizations Array of Organization objects
 * @returns {Boolean} result
 */
Validator.isOrganizations = (organizations) => {
  if (organizations instanceof Array) {
    return _.every(organizations, Validator.isOrganization);
  }
  return false;
};

/**
 * @description Validate Spark Person Object.
 *
 * @function
 * @memberof Validator
 * @param {Person} person Person object
 * @returns {Boolean} result
 */
Validator.isPerson = (person) => {
  const result = (typeof person === 'object'
    && person.displayName
    && person.firstName
    && person.lastName
    && person.emails
  );
  return result;
};

/**
 * @description Validate Spark Person Objects in Array.
 *
 * @function
 * @memberof Validator
 * @param {Array} people Array of Person objects
 * @returns {Boolean} result
 */
Validator.isPeople = (people) => {
  if (people instanceof Array) {
    return _.every(people, Validator.isPerson);
  }
  return false;
};

/**
 * @description Validate Spark Person Search Object.
 *
 * @function
 * @memberof Validator
 * @param {PersonSearch} searchObj Person Search object
 * @returns {Boolean} result
 */
Validator.isPersonSearch = (searchObj) => {
  const result = (typeof searchObj === 'object'
    && (searchObj.id || searchObj.displayName || searchObj.email)
  );
  return result;
};

/**
 * @description Validate Spark Role Object.
 *
 * @function
 * @memberof Validator
 * @param {Role} role Role object
 * @returns {Boolean} result
 */
Validator.isRole = (role) => {
  const result = (typeof role === 'object'
    && role.id
    && role.name
  );
  return result;
};

/**
 * @description Validate Spark Role Objects in Array.
 *
 * @function
 * @memberof Validator
 * @param {Array} roles Array of Role objects
 * @returns {Boolean} result
 */
Validator.isRoles = (roles) => {
  if (roles instanceof Array) {
    return _.every(roles, Validator.isRole);
  }
  return false;
};

/**
 * @description Validate Spark Room Object.
 *
 * @function
 * @memberof Validator
 * @param {Room} room Room Object
 * @returns {Boolean} result
 */
Validator.isRoom = (room) => {
  const result = (typeof room === 'object'
    && room.id
    && _.has(room, 'title')
    && room.type
  );
  return result;
};

/**
 * @description Validate Spark Room Objects in Array.
 *
 * @function
 * @memberof Validator
 * @param {Array} rooms Array of Room objects
 * @returns {Boolean} result
 */
Validator.isRooms = (rooms) => {
  if (rooms instanceof Array) {
    return _.every(rooms, Validator.isRoom);
  }
  return false;
};

/**
 * @description Validate Spark Room Search Object.
 *
 * @function
 * @memberof Validator
 * @param {RoomSearch} searchObj RoomSearch object
 * @returns {Boolean} result
 */
Validator.isRoomSearch = (searchObj) => {
  const result = (typeof searchObj === 'object'
    && (searchObj.teamId || searchObj.type)
  );
  return result;
};

/**
 * @description Validate Spark Team Object.
 *
 * @function
 * @memberof Validator
 * @param {Team} team Team object
 * @returns {Boolean} result
 */
Validator.isTeam = (team) => {
  if (team instanceof Array) {
    return (typeof team[0] === 'object' && team[0].id && team[0].name);
  }
  return (typeof team === 'object' && team.id && team.name);
};

/**
 * @description Validate Spark Team Objects in Array.
 *
 * @function
 * @memberof Validator
 * @param {Array} teams Array of Team objects
 * @returns {Boolean} result
 */
Validator.isTeams = (teams) => {
  if (teams instanceof Array) {
    return _.every(teams, Validator.isTeam);
  }
  return false;
};

/**
 * @description Validate Spark Team Membership Object.
 *
 * @function
 * @memberof Validator
 * @param {TeamMembership} teamMembership TeamMembership object
 * @returns {Boolean} result
 */
Validator.isTeamMembership = (teamMembership) => {
  const result = (typeof teamMembership === 'object'
    && teamMembership.teamId
    && teamMembership.personId
    && teamMembership.personEmail
    && validator.isEmail(teamMembership.personEmail)
  );
  return result;
};

/**
 * @description Validate Spark Team Membership Objects in Array.
 *
 * @function
 * @memberof Validator
 * @param {Array} teamMemberships Array of TeamMembership objects
 * @returns {Boolean} result
 */
Validator.isTeamMemberships = (teamMemberships) => {
  if (teamMemberships instanceof Array) {
    return _.every(teamMemberships, Validator.isTeamMembership);
  }
  return false;
};

/**
 * @description Validate Spark Team Memebership Search Object.
 *
 * @function
 * @memberof Validator
 * @param {TeamMembershipSearch} searchObj TeamMembership object
 * @returns {Boolean} result
 */
Validator.isTeamMembershipSearch = (searchObj) => {
  if (typeof searchObj !== 'object') {
    return false;
  }
  if (!searchObj.teamId) {
    return false;
  }
  return true;
};

/**
 * @description Validate Spark Webhook Object.
 *
 * @function
 * @memberof Validator
 * @param {Webhook} webhook Webhook object
 * @returns {Boolean} result
 */
Validator.isWebhook = (webhook) => {
  const result = (typeof webhook === 'object'
    && webhook.name
    && webhook.targetUrl
    && webhook.resource
    && webhook.event
  );
  return result;
};

/**
 * @description Validate Spark Webhook Objects in Array.
 *
 * @function
 * @memberof Validator
 * @param {Array} webhooks Array of Webhook objects
 * @returns {Boolean} result
 */
Validator.isWebhooks = (webhooks) => {
  if (webhooks instanceof Array) {
    return _.every(webhooks, Validator.isWebhook);
  }
  return false;
};

/**
 * @description Validate Spark Webhook Search Object.
 *
 * @function
 * @memberof Validator
 * @param {WebhookSearch} searchObj TeamMembership object
 * @returns {Boolean} result
 */
Validator.isWebhookSearch = (searchObj) => {
  if (typeof searchObj !== 'object') {
    return false;
  }
  return true;
};

module.exports = Validator;
