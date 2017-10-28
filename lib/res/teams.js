const when = require('when');
const validator = require('../validator');

/**
 * Team Object
 *
 * @namespace Team
 * @property {String} id - Message ID
 * @property {String} name - Team name
 * @property {String} created - Date Team created (ISO 8601)
 */

const Teams = (Spark) => {
  const teams = {
    /**
     * @description Return all Spark Teams that the authenticated account is in.
     * If 'max' is not specifed, returns all.
     *
     * @memberof Spark
     * @function
     * @param {Integer} [max] - Number of records to return (optional)
     * @returns {Promise.Array.<Team>} Teams Collection
     *
     * @example
     * spark.teamsGet(10)
     *   .then(teams => teams.forEach(team => console.log(team.name)))
     *   .catch(err => console.error(err));
     */
    teamsGet: (...args) => {
      const maxResults = args.length > 0 && typeof args[0] === 'number' ? args.shift() : 0;
      return Spark.request('get', 'teams', { max: Spark.maxPageItems }, maxResults);
    },

    /**
     * @description Returns a Spark Team Object specified by Team ID.
     *
     * @memberof Spark
     * @function
     * @param {String} teamId - Spark Team ID
     * @returns {Promise.<Team>} Team
     *
     * @example
     * spark.teamGet('Tm90aGluZyB0byBzZWUgaGVy')
     *   .then(team => console.log(team.name))
     *   .catch(err => console.error(err));
     */
    teamGet: (teamId) => {
      if (typeof teamId !== 'string') {
        return when.reject(new Error('invalid arguments'));
      }
      return Spark.request('get', 'teams', teamId);
    },

    /**
     * @description Add new Spark Team.
     *
     * @memberof Spark
     * @function
     * @param {String} name - Name for new Team
     * @returns {Promise.<Team>} Team
     *
     * @example
     * spark.teamAdd('myteam')
     *   .then(team => console.log(team.name))
     *   .catch(err => console.error(err));
     */
    teamAdd: (name) => {
      if (typeof name !== 'string') {
        return when.reject(new Error('invalid arguments'));
      }
      return Spark.request('post', 'teams', { name });
    },

    /**
     * @description Update a Team.
     *
     * @memberof Spark
     * @function
     * @param {Object.<Team>} team - Spark Team Object
     * @returns {Promise.<Team>} Team
     *
     * @example
     * spark.teamGet('Tm90aGluZyB0byBzZWUgaGVy')
     *   .then((team) => {
     *     team.name = 'Another Team';
     *     return spark.teamUpdate(team);
     *   })
     *   .then(team => console.log(team.name))
     *   .catch(err => console.error(err));
     */
    teamUpdate: (team) => {
      // if team object is valid
      if (team && typeof team === 'object' && validator.isTeam(team)) {
        // update the team
        return Spark.request('put', 'people', team.id, team);
      }
      return when.reject(new Error('invalid or missing team object'));
    },

    /**
     * @description Remove Spark Team by ID.
     *
     * @memberof Spark
     * @function
     * @param {String} teamId Spark Team ID
     * @returns {Promise} Fulfilled promise
     *
     * @example
     * spark.teamRemove('Tm90aGluZyB0byBzZWUgaGVy')
     *   .then(() => console.log('Team removed.'))
     *   .catch(err => console.error(err));
     */
    teamRemove: (teamId) => {
      if (typeof teamId !== 'string') {
        return when.reject(new Error('invalid arguments'));
      }
      return Spark.request('delete', 'teams', teamId);
    },
  };

  return teams;
};

module.exports = Teams;
