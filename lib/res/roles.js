'use strict';

/**
 * Role Object
 *
 * @namespace Role
 * @property {String} id - Role ID
 * @property {String} name - Role name
 */

module.exports = function(Spark) {

  /**
   * Returns all Spark Roles that the authenticated account is in. If 'max' is not specifed, returns all.
   *
   * @function
   * @param {Integer} [max] - Number of records to return (optional)
   * @returns {Promise.Array.<Role>}
   *
   * @example
   * spark.rolesGet(100)
   *   .then(function(roles) {
   *     // process roles as array
   *     roles.forEach(function(role) {
   *       console.log(role.name);
   *     });
   *   })
   *   .catch(function(err) {
   *     // process error
   *     console.log(err);
   *   });
   */
  Spark.rolesGet = function(maxResults) {
    return Spark.request('get', 'roles', { max: Spark.maxPageItems }, maxResults);
  };

  /**
   * Returns details for a Spark Role pecified by Role ID.
   *
   * @function
   * @param {String} roleId - Spark Role ID
   * @returns {Promise.<Role>}
   *
   * @example
   * spark.roleGet('Tm90aGluZyB0byBzZWUgaGVyZS4uLiBNb3ZlIGFsb25nLi4u')
   *   .then(function(role) {
   *     console.log(role.name);
   *   })
   *   .catch(function(err) {
   *     // process error
   *     console.log(err);
   *   });
   */
  Spark.roleGet = function(roleId) {
    return Spark.request('get', 'roles', roleId);
  };

  // return the Spark Object
  return Spark;
};
