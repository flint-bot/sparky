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
 * @property {Boolean} isModerator - Membership is a moderator
 * @property {String} created - Date Membership created (ISO 8601)
 */

const TeamMemberships = (Spark) => {
  const teamMemberships = {
    /**
     * @description Return all Spark Team Memberships for a specific Team that
     * the authenticated account is in. If 'max' is not specifed, returns all.
     *
     * @memberof Spark
     * @function
     * @param {String} teamId Spark Team Memebership ID
     * @param {Integer} [max] Number of records to return
     * @returns {Promise.Array.<TeamMembership>} Array of Spark TeamMembership objects
     *
     * @example
     * spark.teamMembershipsGet('Tm90aGluZyB0byBzZWUgaGVy', 100)
     *   .then(tms => tms.forEach(tm => console.log(tm.personEmail)))
     *   .catch(err => console.error(err));
     */
    teamMembershipsGet: (...args) => {
      const teamMembershipSearch = args.length > 0 && typeof args[0] === 'object' ? args.shift() : {};
      const teamId = args.length > 0 && typeof args[0] === 'string' ? args.shift() : false;
      const maxResults = args.length > 0 && typeof args[0] === 'number' ? args.shift() : 0;
      teamMembershipSearch.max = Spark.maxPageItems;
      if (teamId) {
        teamMembershipSearch.teamId = teamId;
      }
      if (!validator.isTeamMembershipSearch(teamMembershipSearch)) {
        return when.reject(new Error('missing required argument'));
      }
      return Spark.request('get', 'team/memberships', teamMembershipSearch, maxResults);
    },

    /**
     * @description Return Spark Team Membership specified by Membership ID.
     *
     * @memberof Spark
     * @function
     * @param {String} membershipId Spark Membership ID
     * @returns {Promise.<TeamMembership>} Spark TeamMembership object
     *
     * @example
     * spark.membershipGet('Tm90aGluZyB0byBzZWUgaGVy')
     *   .then(tm => console.log(tm.personEmail))
     *   .catch(err => console.error(err));
     */
    teamMembershipGet: (membershipId) => {
      if (typeof membershipId !== 'string') {
        return when.reject(new Error('invalid arguments'));
      }
      return Spark.request('get', 'team/memberships', membershipId);
    },

    /**
     * @description Add new Spark Team Membership.
     *
     * @memberof Spark
     * @function
     * @param {String} teamId Spark Team Memebership ID
     * @param {String} personEmail Email address of person to add
     * @param {Boolean} isModerator Boolean value to add as moderator
     * @returns {Promise.<TeamMembership>} Spark TeamMembership object
     *
     * @example
     * spark.teamMembershipAdd('Tm90aGluZyB0byBzZWUgaGVy', 'aperson@company.com')
     *   .then(tm => console.log(tm.personEmail))
     *   .catch(err => console.error(err));
     *
     * @example
     * const teamMembershipObj = {
     *   personEmail: 'test@test.com',
     *   teamId: 'Tm90aGluZyB0byBzZWUgaGVy',
     *   isModerator: true,
     * };
     * spark.teamMembershipAdd(teamMembershipObj)
     *   .then(tm => console.log(tm.personEmail))
     *   .catch(err => console.error(err));
     */
    teamMembershipAdd: (...args) => {
      const membershipObj = args.length > 0 && typeof args[0] === 'object' ? args.shift() : false;
      const teamId = args.length > 0 && typeof args[0] === 'string' ? args.shift() : false;
      const personEmail = args.length > 0 && typeof args[0] === 'string' ? args.shift() : false;
      const isModerator = args.length > 0 && typeof args[0] === 'boolean' ? args.shift() : false;
      if (membershipObj && validator.isTeamMembershipSearch(membershipObj)) {
        return Spark.request('post', 'team/memberships', membershipObj);
      }
      if (teamId && validator.isEmail(personEmail)) {
        return Spark.request('post', 'team/memberships', {
          personEmail: personEmail,
          teamId: teamId,
          isModerator: (typeof isModerator === 'boolean' && isModerator),
        });
      }
      return when.reject(new Error('invalid arguments'));
    },

    /**
     * @description Update a Team Membership.
     *
     * @memberof Spark
     * @function
     * @param {object.<TeamMembership>} teamMembership Spark TeamMembership object
     * @returns {Promise.<TeamMembership>} Spark TeamMembership object
     *
     * @example
     * spark.teamMembershipGet('Tm90aGluZyB0byBzZWUgaGVy')
     *   .then((tm) => {
     *     tm.isModerator = true;
     *     return spark.teamMembershipUpdate(tm);
     *   )
     *   .then(tm => console.log(tm.isModerator))
     *   .catch(err => console.error(err));
     */
    teamMembershipUpdate: (teamMembership) => {
      // if teamMembership object is valid
      if (teamMembership && typeof teamMembership === 'object' && validator.isTeamMembership(teamMembership)) {
        // update the teamMembership
        return Spark.request('put', 'people', teamMembership.id, teamMembership);
      }
      return when.reject(new Error('invalid or missing teamMembership object'));
    },

    /**
     * @description Remove Spark Team Membership by ID..
     *
     * @memberof Spark
     * @function
     * @param {String} membershipId Spark Team Membership ID
     * @returns {Promise} Fulfilled promise
     *
     * @example
     * spark.teamMembershipRemove('Tm90aGluZyB0byBzZWUgaGVy')
     *   .then(() => console.log('Team Membership removed.'))
     *   .catch(err => console.error(err));
     */
    teamMembershipRemove: (membershipId) => {
      if (typeof membershipId !== 'string') {
        return when.reject(new Error('invalid arguments'));
      }
      return Spark.request('delete', 'team/memberships', membershipId);
    },
  };

  return teamMemberships;
};

module.exports = TeamMemberships;
