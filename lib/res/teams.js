'use strict';

const when = require('when');

const validator = require('../validator');

/**
 * Team Object
 *
 * @namespace Team
 * @property {String} id - Message ID
 * @property {String} name - Team name
 * @property {Date} created - Date Team created
 */

module.exports = function(Spark) {

  /**
   * Return all Spark Teams that the authenticated account is in. If 'max' is not specifed, returns all.
   *
   * @function
   * @param {Integer} [max] - Number of records to return (optional)
   * @returns {Promise.Array.<Team>} Teams Collection
   *
   * @example
   * spark.teamsGet(10)
   *   .then(function(teams) {
   *     // process teams as array
   *     teams.forEach(function(team) {
   *       console.log(team.name);
   *     });
   *   })
   *   .catch(function(err) {
   *     // process error
   *     console.log(err);
   *   });
   */
  Spark.teamsGet = function(maxResults) {
    return Spark.request('get', 'teams', { max: Spark.maxPageItems }, maxResults);
  };

  /**
   * Returns a Spark Team Object specified by Team ID.
   *
   * @function
   * @param {String} teamId - Spark Team ID
   * @returns {Promise.<Team>} Team
   *
   * @example
   * spark.teamGet('Tm90aGluZyB0byBzZWUgaGVyZS4uLiBNb3ZlIGFsb25nLi4u')
   *   .then(function(team) {
   *     console.log(team.name);
   *   })
   *   .catch(function(err) {
   *     // process error
   *     console.log(err);
   *   });
   */
  Spark.teamGet = function(teamId) {
    return Spark.request('get', 'teams', teamId);
  };

  /**
   * Add new Spark Team.
   *
   * @function
   * @param {String} name - Name for new Team
   * @returns {Promise.<Team>} Team
   *
   * @example
   * spark.teamAdd('myteam')
   *   .then(function(team) {
   *     console.log(team.name);
   *   })
   *   .catch(function(err) {
   *     // process error
   *     console.log(err);
   *   });
   */
  Spark.teamAdd = function(name) {
    return Spark.request('post', 'teams', { name: name });
  };

  /**
   * Update a Team.
   *
   * @function
   * @param {Object.<Team>} team - Spark Team Object
   * @returns {Promise.<Team>} Team
   *
   * @example
   * spark.teamGet('Tm90aGluZyB0byBzZWUgaGVyZS4uLiBNb3ZlIGFsb25nLi4u')
   *   .then(function(team) {
   *     // change value of retrieved team object
   *     team.name = 'Another Team';
   *     return spark.teamUpdate(team);
   *   )
   *   .then(function(team) {
   *     console.log(team.name);
   *   })
   *   .catch(function(err) {
   *     // process error
   *     console.log(err);
   *   });
   */
  Spark.teamUpdate = function(team) {
    // if team object is valid
    if(team && typeof team === 'object' && validator.isTeam(team)) {
      // update the team
      return Spark.request('put', 'people', team.id, team);
    }

    // else, invalid arguments
    else {
      return when.reject(new Error('invalid or missing team object'));
    }
  };

  /**
   * Remove Spark Team by ID.
   *
   * @function
   * @param {String} teamId - Spark Team ID
   * @returns {Promise}
   *
   * @example
   * spark.teamRemove('Tm90aGluZyB0byBzZWUgaGVyZS4uLiBNb3ZlIGFsb25nLi4u')
   *   .then(function() {
   *     console.log('Team removed.');
   *   })
   *   .catch(function(err) {
   *     // process error
   *     console.log(err);
   *   });
   */
  Spark.teamRemove = function(teamId) {
    return Spark.request('delete', 'teams', teamId)
      .then(res => when(true));
  };

  // return the Spark Object
  return Spark;
};
