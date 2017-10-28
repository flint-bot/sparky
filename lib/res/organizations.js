const when = require('when');

/**
 * @description Organization Object
 *
 * @namespace Organization
 * @property {String} id - Organization ID
 * @property {String} displayName - Organization name
 * @property {String} created - Date Organization created (ISO 8601)
 */

const Organizations = (Spark) => {
  const organizations = {
    /**
     * @description Return all Spark Organizations that the authenticated
     * account is in. If 'max' is not specifed, returns all.
     *
     * @memberof Spark
     * @function
     * @param {Integer} [max] Number of records to return (optional)
     * @returns {Promise.Array.<Organization>} Array of Spark Organization objects
     *
     * @example
     * spark.organizationsGet(10)
     *   .then(organizations => organizations.forEach(organization => console.log(organization.id)))
     *   .catch(err => console.error(err));
     */
    organizationsGet: (...args) => {
      const maxResults = args.length > 0 && typeof args[0] === 'number' ? args.shift() : 0;
      return Spark.request('get', 'organizations', { max: Spark.maxPageItems }, maxResults);
    },

    /**
     * @description Return Spark Organization specified by License ID.
     *
     * @memberof Spark
     * @function
     * @param {String} orgId Spark Organization ID
     * @returns {Promise.<Organization>} Spark Organization object
     *
     * @example
     * spark.organizationGet('Tm90aGluZyB0byBzZWUgaGVy')
     *   .then(organization => console.log(organization.id))
     *   .catch(err => console.error(err));
     */
    organizationGet: (orgId) => {
      if (typeof orgId !== 'string') {
        return when.reject(new Error('invalid arguments'));
      }
      return Spark.request('get', 'organizations', orgId);
    },
  };

  return organizations;
};

module.exports = Organizations;
