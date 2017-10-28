const when = require('when');

/**
 * @description Role Object
 *
 * @namespace Role
 * @property {String} id - Role ID
 * @property {String} name - Role name
 */

const Roles = (Spark) => {
  const roles = {
    /**
     * @description Returns all Spark Roles that the authenticated account is
     * in. If 'max' is not specifed, returns all.
     *
     * @memberof Spark
     * @function
     * @param {Integer} [max] Number of records to return (optional)
     * @returns {Promise.Array.<Role>} Array of Spark Role object
     *
     * @example
     * spark.rolesGet(10)
     *   .then(roles => roles.forEach(role => console.log(role.name)))
     *   .catch(err => console.error(err));
     */
    rolesGet: (...args) => {
      const maxResults = args.length > 0 && typeof args[0] === 'number' ? args.shift() : 0;
      return Spark.request('get', 'roles', { max: Spark.maxPageItems }, maxResults);
    },

    /**
     * Returns details for a Spark Role pecified by Role ID.
     *
     * @memberof Spark
     * @function
     * @param {String} roleId Spark Role ID
     * @returns {Promise.<Role>} Spark Role object
     *
     * @example
     * spark.roleGet('Tm90aGluZyB0byBzZWUgaGVy')
     *   .then(role => console.log(role.name))
     *   .catch(err => console.error(err));
     */
    roleGet: (roleId) => {
      if (typeof roleId !== 'string') {
        return when.reject(new Error('invalid arguments'));
      }
      return Spark.request('get', 'roles', roleId);
    },
  };

  return roles;
};

module.exports = Roles;
