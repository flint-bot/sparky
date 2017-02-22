'use strict';

const when = require('when');

const validator = require('../validator');

/**
 * Team Membership Object
 *
 * @namespace TeamMembership
 * @property {String} id - Membership ID
 * @property {String} teamId - Team ID
 * @property {String} personId - Person ID
 * @property {String} personEmail - Person Email
 * @property {boolean} isModerator - Membership is a moderator
 * @property {date} created - Date Membership created
 */

module.exports = function(Spark) {

  /**
   * Return all Spark Team Memberships for a specific Team that the authenticated account is in. If 'max' is not specifed, returns all.
   *
   * @function
   * @param {String} teamId - Spark Team ID
   * @param {Integer} [max] - Number of records to return
   * @returns {Promise.Array.<TeamMembership>} TeamMemberships Collection
   *
   * @example
   * spark.teamMembershipsGet('Tm90aGluZyB0byBzZWUgaGVyZS4uLiBNb3ZlIGFsb25nLi4u', 100)
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
  Spark.teamMembershipsGet = function(teamId, maxResults) {
    return Spark.request('get', 'team/memberships', {
      teamId: teamId,
      max: Spark.maxPageItems
    }, maxResults);
  };

  /**
   * Return Spark Team Membership specified by Membership ID.
   *
   * @function
   * @param {String} membershipId - Spark Membership ID
   * @returns {Promise.<TeamMembership>} TeamMembership
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
  Spark.teamMembershipGet = function(membershipId) {
    return Spark.request('get', 'team/memberships', membershipId);
  };

  /**
   * Add new Spark Team Membership.
   *
   * @function
   * @param {String} teamId - Spark Team ID
   * @param {String} personEmail - Email address of person to add
   * @param {Boolean} isModerator - Boolean value to add as moderator
   * @returns {Promise.<TeamMembership>} TeamMembership
   *
   * @example
   * spark.teamMembershipAdd('Tm90aGluZyB0byBzZWUgaGVyZS4uLiBNb3ZlIGFsb25nLi4u', 'aperson@company.com')
   *   .then(function(membership) {
   *     console.log(membership.id);
   *   })
   *   .catch(function(err){
   *     console.log(err);
   *   });
   */
  Spark.teamMembershipAdd = function(teamId, personEmail, isModerator) {
    if(typeof personEmail === 'string' && validator.isEmail(personEmail)) {
      return Spark.request('post', 'team/memberships', {
        personEmail: personEmail,
        teamId: teamId,
        isModerator: (typeof isModerator === 'boolean' && isModerator)
      });
    }

    else {
      return when.reject(new Error('not a valid email'));
    }
  };

  /**
   * Update a Team Membership.
   *
   * @function
   * @param {Object.<TeamMembership>} teamMembership - Spark TeamMembership Object
   * @returns {Promise.<TeamMembership>} TeamMembership
   *
   * @example
   * spark.teamMembershipGet(Tm90aGluZyB0byBzZWUgaGVyZS4uLiBNb3ZlIGFsb25nLi4u)
   *   .then(function(teamMembership) {
   *     // change value of retrieved teamMembership object
   *     teamMembership.isModerator = true;
   *     return spark.teamMembershipUpdate(teamMembership);
   *   )
   *   .then(function(teamMembership) {
   *     console.log(teamMembership.isModerator);
   *   })
   *   .catch(function(err) {
   *     // process error
   *     console.log(err);
   *   });
   */
  Spark.teamMembershipUpdate = function(teamMembership) {
    // if teamMembership object is valid
    if(teamMembership && typeof teamMembership === 'object' && validator.isTeamMembership(teamMembership)) {
      // update the teamMembership
      return Spark.request('put', 'people', teamMembership.id, teamMembership);
    }

    // else, invalid arguments
    else {
      return when.reject(new Error('invalid or missing teamMembership object'));
    }
  };

  /**
   * Remove Spark Team Membership by ID..
   *
   *
   * @function
   * @param {String} membershipId - Spark Membership ID
   * @returns {Promise}
   *
   * @example
   * spark.teamMembershipRemove('Tm90aGluZyB0byBzZWUgaGVyZS4uLiBNb3ZlIGFsb25nLi4u')
   *   .then(function() {
   *     console.log('Membership removed');
   *   })
   *   .catch(function(err){
   *     console.log(err);
   *   });
   */
  Spark.teamMembershipRemove = function(membershipId) {
    return Spark.request('delete', 'team/memberships', membershipId)
      .then(res => when(true));
  };

  // return the Spark Object
  return Spark;
};
