'use strict';

/**
 * Organization Object
 *
 * @namespace Organization
 * @property {String} id - Organization ID
 * @property {String} displayName - Organization name
 * @property {String} created - Date Organization created (ISO 8601)
 */

module.exports = function(Spark) {

  /**
   * Return all Spark Organizations that the authenticated account is in. If 'max' is not specifed, returns all.
   *
   * @function
   * @param {Integer} [max] - Number of records to return (optional)
   * @returns {Promise.Array.<Organization>} Organizations Collection
   *
   * @example
   * spark.organizationsGet(100)
   *   .then(function(organizations) {
   *     // process organizations as array
   *     organizations.forEach(function(organization) {
   *       console.log(organization.displayName);
   *     });
   *   })
   *   .catch(function(err) {
   *     // process error
   *     console.log(err);
   *   });
   */
  Spark.organizationsGet = function(maxResults) {
    return Spark.request('get', 'organizations', { max: Spark.maxPageItems }, maxResults);
  };

  /**
   * Return Spark Organization specified by License ID.
   *
   * @function
   * @param {String} orgId - Spark Organization ID
   * @returns {Promise.<Organization>}
   *
   * @example
   * spark.organizationGet('Tm90aGluZyB0byBzZWUgaGVyZS4uLiBNb3ZlIGFsb25nLi4u')
   *   .then(function(organization) {
   *     console.log(organization.displayName);
   *   })
   *   .catch(function(err) {
   *     // process error
   *     console.log(err);
   *   });
   */
  Spark.organizationGet = function(orgId) {
    return Spark.request('get', 'organizations', orgId);
  };

  // return the Spark Object
  return Spark;
};
