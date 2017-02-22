'use strict';

/**
 * License Object
 *
 * @namespace License
 * @property {String} id - License ID
 * @property {String} name - License name
 * @property {Integer} totalUnits - Total units of license available
 * @property {Integer} consumedUnits - Number of license units consumed
 */

module.exports = function(Spark) {

  /**
   * Returns all Spark Licenses for a given Organization ID. If no organization ID argument is passed, licenses are returned for the Organization that the authenticated account is in. If 'max' is not specifed, returns all.
   *
   * @function
   * @param {String} [orgId] - The organization ID to query (optional)
   * @param {Integer} [max] - Number of records to return (optional)
   * @returns {Promise.Array.<License>} Licenses Collection
   *
   * @example
   * spark.licensesGet('Tm90aGluZyB0byBzZWUgaGVyZS4uLiBNb3ZlIGFsb25nLi4u', 10)
   *   .then(function(licenses) {
   *     // process licenses as array
   *     licenses.forEach(function(license) {
   *       console.log(license.name);
   *     });
   *   })
   *   .catch(function(err) {
   *     // process error
   *     console.log(err);
   *   });
   */
  Spark.licensesGet = function(orgId, maxResults) {
    let args = Array.prototype.slice.call(arguments);
    orgId = args.length > 0 && typeof args[0] === 'string' ? args.shift() : undefined;
    maxResults = args.length > 0 && typeof args[0] === 'number' ? args.shift() : undefined;

    let licenseSearch = { max: Spark.maxPageItems };

    if(orgId) licenseSearch.orgId = orgId;

    return Spark.request('get', 'licenses', licenseSearch, maxResults);
  };

  /**
   * Returns a Spark License specified by License ID.
   *
   * @function
   * @param {String} licenseId - Spark License ID
   * @returns {Promise.<License>} License
   *
   * @example
   * spark.licenseGet('Tm90aGluZyB0byBzZWUgaGVyZS4uLiBNb3ZlIGFsb25nLi4u')
   *   .then(function(license) {
   *     console.log(license.name);
   *   })
   *   .catch(function(err) {
   *     // process error
   *     console.log(err);
   *   });
   */
  Spark.licenseGet = function(licenseId) {
    return Spark.request('get', 'licenses', licenseId);
  };

  // return the Spark Object
  return Spark;
};
