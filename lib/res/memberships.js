'use strict';

const when = require('when');

const validator = require('../validator');

/**
 * Membership Object
 *
 * @namespace Membership
 * @property {String} id - Membership ID
 * @property {String} roomId - Room ID
 * @property {String} personId - Person ID
 * @property {String} personEmail - Person Email
 * @property {Boolean} isModerator - Membership is a moderator
 * @property {Boolean} isMonitor - Membership is a monitor
 * @property {String} created - Date Membership created (ISO 8601)
 */

module.exports = function(Spark) {

  /**
   * Returns all Spark Memberships that the authenticated account is in. If 'max' is not specifed, returns all.
   *
   * @function
   * @param {Object} [membershipSearch] - Spark Membership Search Object (optional)
   * @param {Integer} [max] - Number of records to return
   * @returns {Promise.Array.<Membership>} Memberships Collection
   *
   * @example
   * spark.membershipsGet({ roomId: 'Tm90aGluZyB0byBzZWUgaGVyZS4uLiBNb3ZlIGFsb25nLi4u' }, 10)
   *   .then(function(memberships) {
   *     // process memberships as array
   *     memberships.forEach(function(membership) {
   *       console.log(membership.personEmail);
   *     });
   *   })
   *   .catch(function(err) {
   *     // process error
   *     console.log(err);
   *   });
   */
  Spark.membershipsGet = function(membershipSearch, maxResults) {
    let args = Array.prototype.slice.call(arguments);
    membershipSearch = args.length > 0 && typeof args[0] === 'object' ? args.shift() : undefined;
    maxResults = args.length > 0 && typeof args[0] === 'number' ? args.shift() : undefined;

    if(membershipSearch && !validator.isMembershipSearch(membershipSearch)) {
      return when.reject(new Error('invalid search'));;
    }

    if(!membershipSearch) {
      membershipSearch = {};
    }

    membershipSearch.max = Spark.maxPageItems
    return Spark.request('get', 'memberships', membershipSearch, maxResults);
  };

  /**
   * Returns Spark Membership by ID.
   *
   * @function
   * @param {String} membershipId - Spark Membership ID
   * @returns {Promise.<Membership>} Membership
   *
   * @example
   * spark.membershipGet('Tm90aGluZyB0byBzZWUgaGVyZS4uLiBNb3ZlIGFsb25nLi4u')
   *   .then(function(membership) {
   *     console.log(membership.personEmail);
   *   })
   *   .catch(function(err){
   *     console.log(err);
   *   });
   */
  Spark.membershipGet = function(membershipId) {
    return Spark.request('get', 'memberships', membershipId);
  };

  /**
   * Add new Spark Membership given Room ID, email address, and moderator status.
   *
   * @function
   * @param {String} roomId - Spark Room ID
   * @param {String} personEmail - Email address of person to add
   * @param {Boolean} [isModerator] - True if moderator
   * @returns {Promise.<Membership>} Membership
   *
   * @example
   * spark.membershipAdd('Tm90aGluZyB0byBzZWUgaGVyZS4uLiBNb3ZlIGFsb25nLi4u', 'aperson@company.com')
   *   .then(function(membership) {
   *     console.log(membership.id);
   *   })
   *   .catch(function(err){
   *     console.log(err);
   *   });
   */
  Spark.membershipAdd = function(roomId, personEmail, isModerator) {
    if(typeof personEmail === 'string' && validator.isEmail(personEmail)) {
      return Spark.request('post', 'memberships', {
        personEmail: personEmail,
        roomId: roomId,
        isModerator: (typeof isModerator === 'boolean' && isModerator)
      });
    }

    else {
      return when.reject(new Error('not a valid email'));
    }
  };

  /**
   * Update a Membership.
   *
   * @function
   * @param {Object.<Membership>} membership - Spark Membership Object
   * @returns {Promise.<Membership>}
   *
   * @example
   * spark.membershipGet('Tm90aGluZyB0byBzZWUgaGVyZS4uLiBNb3ZlIGFsb25nLi4u')
   *   .then(function(membership) {
   *     // change value of retrieved membership object
   *     membership.isModerator = true;
   *     return spark.membershipUpdate(membership);
   *   )
   *   .then(function(membership) {
   *     console.log(membership.isModerator);
   *   })
   *   .catch(function(err) {
   *     // process error
   *     console.log(err);
   *   });
   */
  Spark.membershipUpdate = function(membership) {
    // if membership object is valid
    if(membership && typeof membership === 'object' && validator.isMembership(membership)) {
      // update the membership
      return Spark.request('put', 'memberships', membership.id, membership);
    }

    // else, invalid arguments
    else {
      return when.reject(new Error('invalid or missing membership object'));
    }
  };

  /**
   * Remove Spark Membership by ID.
   *
   * @function
   * @param {String} membershipId - Spark Membership ID
   * @returns {Promise}
   *
   * @example
   * spark.membershipRemove('Tm90aGluZyB0byBzZWUgaGVyZS4uLiBNb3ZlIGFsb25nLi4u')
   *   .then(function() {
   *     console.log('Membership removed');
   *   })
   *   .catch(function(err){
   *     console.log(err);
   *   });
   */
  Spark.membershipRemove = function(membershipId) {
    return Spark.request('delete', 'memberships', membershipId)
      .then(res => when(true));
  };

  // return the Spark Object
  return Spark;
};
