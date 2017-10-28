const when = require('when');
const validator = require('../validator');

/**
 * @description License Object
 *
 * @namespace License
 * @property {String} id - License ID
 * @property {String} name - License name
 * @property {Integer} totalUnits - Total units of license available
 * @property {Integer} consumedUnits - Number of license units consumed
 */

const Licenses = (Spark) => {
  const licenses = {
    /**
     * @description Returns all Spark Licenses for a given Organization ID. If
     * no organization ID argument is passed, licenses are returned for the
     * Organization that the authenticated account is in. If 'max' is not
     * specifed, returns all. Alternativly, you can pass a licenses object
     * instead of the orgId string.
     *
     * @memberof Spark
     * @function
     * @param {String} [orgId] The organization ID to query (optional)
     * @param {Integer} [max] Number of records to return (optional)
     * @returns {Promise.Array.<License>} Licenses Collection
     *
     * @example
     * spark.licensesGet('Tm90aGluZyB0byBzZWUgaGVy', 10)
     *   .then(licenses => licenses.forEach(license => console.log(license.name)))
     *   .catch(err => console.error(err));
     *
     * @example
     * const licenseSearchObj = {
     *   orgId: 'Tm90aGluZyB0byBzZWUgaGVy',
     * };
     * spark.licensesGet(licenseSearchObj, 10)
     *   .then(licenses => licenses.forEach(license => console.log(license.name)))
     *   .catch(err => console.error(err));
     */
    licensesGet: (...args) => {
      const licenseSearch = args.length > 0 && typeof args[0] === 'object' ? args.shift() : {};
      const orgId = args.length > 0 && typeof args[0] === 'string' ? args.shift() : false;
      const maxResults = args.length > 0 && typeof args[0] === 'number' ? args.shift() : 0;
      licenseSearch.max = Spark.maxPageItems;
      if (orgId) {
        licenseSearch.orgId = orgId;
      }
      if (!validator.isLicenseSearch(licenseSearch)) {
        return when.reject(new Error('missing required argument'));
      }
      return Spark.request('get', 'licenses', licenseSearch, maxResults);
    },

    /**
     * @description Returns a Spark License specified by License ID.
     *
     * @memberof Spark
     * @function
     * @param {String} licenseId Spark License ID
     * @returns {Promise.<License>} License
     *
     * @example
     * spark.licenseGet('Tm90aGluZyB0byBzZWUgaGVy')
     *   .then(license => console.log(license.name))
     *   .catch(err => console.error(err));
     */
    licenseGet: (licenseId) => {
      if (typeof licenseId !== 'string') {
        return when.reject(new Error('invalid arguments'));
      }
      return Spark.request('get', 'licenses', licenseId);
    },

  };

  return licenses;
};

module.exports = Licenses;
