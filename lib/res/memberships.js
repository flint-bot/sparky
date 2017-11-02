const when = require('when');
const validator = require('../validator');

/**
 * @description Membership Object
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

const Memberships = (Spark) => {
  const memberships = {
    /**
     * @description Returns all Spark Memberships that the authenticated account
     * is in. If 'max' is not specifed, returns all.
     *
     * @memberof Spark
     * @function
     * @param {Object} [membershipSearch] - Spark Membership Search Object (optional)
     * @param {Integer} [max] - Number of records to return
     * @returns {Promise.Array.<Membership>} Array of Spark Membership objects
     *
     * @example
     * spark.membershipsGet({ roomId: 'Tm90aGluZyB0byBzZWUgaGVy' }, 10)
     *   .then(memberships => memberships.forEach(membership => console.log(membership.id)))
     *   .catch(err => console.error(err));
     */
    membershipsGet: (...args) => {
      let membershipSearch = args.length > 0 && typeof args[0] === 'object' ? args.shift() : {};
      const maxResults = args.length > 0 && typeof args[0] === 'number' ? args.shift() : 0;
      if (!validator.isMembershipSearch(membershipSearch)) {
        membershipSearch = {};
      }
      membershipSearch.max = Spark.maxPageItems;
      return Spark.request('get', 'memberships', membershipSearch, maxResults);
    },

    /**
     * @description Returns Spark Membership by ID.
     *
     * @memberof Spark
     * @function
     * @param {String} membershipId Spark Membership ID
     * @returns {Promise.<Membership>} Spark Membership object
     *
     * @example
     * spark.membershipGet('Tm90aGluZyB0byBzZWUgaGVy')
     *   .then(membership => console.log(membership.id))
     *   .catch(err => console.error(err));
     */
    membershipGet: (membershipId) => {
      if (typeof membershipId !== 'string') {
        return when.reject(new Error('invalid arguments'));
      }
      return Spark.request('get', 'memberships', membershipId);
    },

    /**
     * @description Add new Spark Membership given Room ID, email address, and
     * moderator status. Alternativly, you can pass a membership object as the
     * only argument.
     *
     * @memberof Spark
     * @function
     * @param {String} roomId Spark Room ID
     * @param {String} personEmail Email address of person to add
     * @param {Boolean} [isModerator] True if moderator
     * @returns {Promise.<Membership>} Spark Membership object
     *
     * @example
     * spark.membershipAdd('Tm90aGluZyB0byBzZWUgaGVy', 'aperson@company.com')
     *   .then(membership => console.log(membership.id))
     *   .catch(err => console.error(err));
     *
     * @example
     * const membershipObj = {
     *   personEmail: 'test@test.com',
     *   roomId: 'Tm90aGluZyB0byBzZWUgaGVy',
     *   isModerator: true,
     * };
     * spark.membershipAdd(membershipObj)
     *   .then(membership => console.log(membership.id))
     *   .catch(err => console.error(err));
     */
    membershipAdd: (...args) => {
      const membershipObj = args.length > 0 && typeof args[0] === 'object' ? args.shift() : false;
      const roomId = args.length > 0 && typeof args[0] === 'string' ? args.shift() : false;
      const personEmail = args.length > 0 && typeof args[0] === 'string' ? args.shift() : false;
      const isModerator = args.length > 0 && typeof args[0] === 'boolean' ? args.shift() : false;
      if (membershipObj && validator.isMembershipSearch(membershipObj)) {
        return Spark.request('post', 'memberships', membershipObj);
      }
      if (roomId && validator.isEmail(personEmail)) {
        return Spark.request('post', 'memberships', {
          personEmail: personEmail,
          roomId: roomId,
          isModerator: (typeof isModerator === 'boolean' && isModerator),
        });
      }
      return when.reject(new Error('invalid arguments'));
    },

    /**
     * @description Update a Membership.
     *
     * @memberof Spark
     * @function
     * @param {Object.<Membership>} membership Spark Membership object
     * @returns {Promise.<Membership>} Spark Membership object
     *
     * @example
     * spark.membershipGet('Tm90aGluZyB0byBzZWUgaGVy')
     *   .then((membership) => {
     *     membership.isModerator = true;
     *     return spark.membershipUpdate(membership);
     *   )
     *   .then(membership => console.log(membership.isModerator))
     *   .catch(err => console.error(err));
     */
    membershipUpdate: (membership) => {
      // if membership object is valid
      if (membership && typeof membership === 'object' && validator.isMembership(membership)) {
        // update the membership
        return Spark.request('put', 'memberships', membership.id, membership);
      }
      return when.reject(new Error('invalid or missing membership object'));
    },

    /**
     * @description Remove Spark Membership by ID.
     *
     * @memberof Spark
     * @function
     * @param {String} membershipId - Spark Membership ID
     * @returns {Promise} Fulfilled promise
     *
     * @example
     * spark.membershipRemove('Tm90aGluZyB0byBzZWUgaGVy')
     *   .then(() => console.log('Membership removed.'))
     *   .catch(err => console.error(err));
     */
    membershipRemove: (membershipId) => {
      if (typeof membershipId !== 'string') {
        return when.reject(new Error('invalid arguments'));
      }
      return Spark.request('delete', 'memberships', membershipId);
    },
  };

  return memberships;
};

module.exports = Memberships;
