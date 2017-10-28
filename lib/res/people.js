const when = require('when');
const validator = require('../validator');

/**
 * @description Person Object
 *
 * @namespace Person
 * @property {String} id - Person ID
 * @property {Array.String} emails - Array of email addresses
 * @property {String} displayName - Display name
 * @property {String} firstName - First name
 * @property {String} lastName  - Last name
 * @property {String} avatar - Avatar URL
 * @property {String} orgId - Organization ID
 * @property {Array.String} roles - Array of assigned Role IDs
 * @property {Array.String} licenses - Array of assigned License IDs
 * @property {String} created - Date created (ISO 8601)
 */

const People = (Spark) => {
  const people = {
    /**
     * @description Returns Spark Person Objects. If no arguments are passed and
     * if the authenticated account is part of an Organization and if
     * authenticated account is assigned the Role of Organization Admin, returns
     * all Spark Person objects from the Organizations that the user is in.
     * Otherwise, the PersonSearch object should contain the key "id",
     * "displayName", or "email" to query. If 'max' is not specifed, returns all
     * matched Person Objects.
     *
     * @memberof Spark
     * @function
     * @param {Object} [personSearch] Spark Person Search Object (optional)
     * @param {Integer} [max] Number of records to return (optional)
     * @returns {Promise.Array.<Person>} Array of Spark Person objects
     *
     * @example
     * spark.peopleGet({ displayName: 'John' }, 10)
     *   .then(people => people.forEach(person => console.log(person.displayName)))
     *   .catch(err => console.error(err));
     */
    peopleGet: (...args) => {
      let personSearch = args.length > 0 && typeof args[0] === 'object' ? args.shift() : {};
      const maxResults = args.length > 0 && typeof args[0] === 'number' ? args.shift() : 0;
      if (!validator.isPersonSearch(personSearch)) {
        personSearch = {};
      }
      personSearch.max = Spark.maxPageItems;
      return Spark.request('get', 'people', personSearch, maxResults);
    },

    /**
     * @description Returns a Spark Person Object specified by Person ID.
     *
     * @memberof Spark
     * @function
     * @param {String} personId Spark Person ID
     * @returns {Promise.<Person>} Spark Person object
     *
     * @example
     * spark.personGet('Tm90aGluZyB0byBzZWUgaGVy')
     *   .then(person => console.log(person.displayName))
     *   .catch(err => console.error(err));
     */
    personGet: (personId) => {
      if (typeof personId !== 'string') {
        return when.reject(new Error('invalid arguments'));
      }
      return Spark.request('get', 'people', personId);
    },

    /**
     * @description Return the Spark Person Object of the authenticated account.
     *
     * @memberof Spark
     * @function
     * @returns {Promise.<Person>} Spark Person object
     *
     * @example
     * spark.personMe()
     *   .then(person => console.log(person.displayName))
     *   .catch(err => console.error(err));
     */
    personMe: () => Spark.request('get', 'people', 'me'),

    /**
     * @description Add new Person.
     *
     * @memberof Spark
     * @function
     * @param {Object.<Person>} person Spark Person object
     * @returns {Promise.<Person>} Spark Person object
     *
     * @example
     * let newPerson = {
     *   emails: ['aperson@company.com'],
     *   displayName: 'Any Person',
     *   firstName: 'Any',
     *   lastName: 'Person',
     *   avatar: 'http://lorempixel.com/400/400/',
     *   orgId: 'Tm90aGluZyB0byBzZWUgaGVy',
     *   roles: ['Tm90aGluZyB0byBzZWUgaGVy'],
     *   licenses: ['Tm90aGluZyB0byBzZWUgaGVy']
     * };
     *
     * spark.personAdd(newPerson)
     *   .then(person => console.log(person.displayName))
     *   .catch(err => console.error(err));
     */
    personAdd: (person) => {
      // if person object is valid
      if (person && typeof person === 'object' && validator.isPerson(person)) {
        // add person
        return Spark.request('post', 'people', person);
      }
      return when.reject(new Error('invalid or missing person object'));
    },

    /**
     * @description Update a Person.
     *
     * @memberof Spark
     * @function
     * @param {Object.<Person>} person Spark Person object
     * @returns {Promise.<Person>} Spark Person object
     *
     * @example
     * spark.personGet('Tm90aGluZyB0byBzZWUgaGVy')
     *   .then((person) => {
     *     person.displayName = 'Another Person';
     *     return spark.personUpdate(person);
     *   })
     *   .then(person => console.log(person.displayName))
     *   .catch(err => console.error(err));
     */
    personUpdate: (person) => {
      // if person object is valid
      if (person && typeof person === 'object' && validator.isPerson(person)) {
        // update the person
        return Spark.request('put', 'people', person.id, person);
      }
      return when.reject(new Error('invalid or missing person object'));
    },

    /**
     * @description Remove Spark Person by ID.
     *
     * @memberof Spark
     * @function
     * @param {String} personId Spark Person ID
     * @returns {Promise} Fulfilled promise
     *
     * @example
     * spark.personRemove('Tm90aGluZyB0byBzZWUgaGVy')
     *   .then(() => console.log('Person removed.'))
     *   .catch(err => console.error(err));
     */
    personRemove: (personId) => {
      if (typeof personId !== 'string') {
        return when.reject(new Error('invalid arguments'));
      }
      return Spark.request('delete', 'people', personId);
    },

  };

  return people;
};

module.exports = People;
