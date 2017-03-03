'use strict';

const when = require('when');
const _ = require('lodash');

const validator = require('../validator');

/**
 * Person Object
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
 * @property {Date} created - Date created
 */

module.exports = function(Spark) {

  /**
   * Returns Spark Person Objects. If no arguments are passed and if the authenticated account is part of an Organization and if authenticated account is assigned the Role of Organization Admin, returns all Spark Person objects from the Organizations that the user is in. Otherwise, the PersonSearch object should contain the key "id", "displayName", or "email" to query. If 'max' is not specifed, returns all matched Person Objects.
   *
   * @function
   * @param {Object} [personSearch] - Spark Person Search Object (optional)
   * @param {Integer} [max] - Number of records to return (optional)
   * @returns {Promise.Array.<Person>} People Collection
   *
   * @example
   * spark.peopleGet({ displayName: 'John' }, 10)
   *   .then(function(people) {
   *     // process people as array
   *     people.forEach(function(person) {
   *       console.log(person.displayName);
   *     });
   *   })
   *   .catch(function(err) {
   *     // process error
   *     console.log(err);
   *   });
   */
  Spark.peopleGet = function(personSearch, maxResults) {
    let args = Array.prototype.slice.call(arguments);
    personSearch = args.length > 0 && typeof args[0] === 'object' ? args.shift() : {};
    maxResults = args.length > 0 && typeof args[0] === 'number' ? args.shift() : undefined;

    // if person search object is invalid
    if(!validator.isPersonSearch(personSearch)) {
      personSearch = {};
    }

    personSearch.max = Spark.maxPageItems;

    return Spark.request('get', 'people', personSearch, maxResults);
  };

  /**
   * Returns a Spark Person Object specified by Person ID.
   *
   * @function
   * @param {String} personId - Spark Person ID
   * @returns {Promise.<Person>} Person
   *
   * @example
   * spark.personGet('Tm90aGluZyB0byBzZWUgaGVyZS4uLiBNb3ZlIGFsb25nLi4u')
   *   .then(function(person) {
   *     console.log(person.displayName);
   *   })
   *   .catch(function(err) {
   *     // process error
   *     console.log(err);
   *   });
   */
  Spark.personGet = function(personId) {
   return Spark.request('get', 'people', personId);
  };

  /**
   * Return the Spark Person Object of the authenticated account.
   *
   * @function
   * @returns {Promise.<Person>} Person
   *
   * @example
   * spark.personMe()
   *   .then(function(person) {
   *     console.log(person.displayName);
   *   })
   *   .catch(function(err) {
   *     // process error
   *     console.log(err);
   *   });
   */
  Spark.personMe = function() {
   return Spark.request('get', 'people', 'me');
  };

  /**
   * Add new Person.
   *
   * @function
   * @param {Object.<Person>} person - Spark Person Object
   * @returns {Promise.<Person>} Person
   *
   * @example
   * let newPerson = {
   *   emails: ['aperson@company.com'],
   *   displayName: 'Any Person',
   *   firstName: 'Any',
   *   lastName: 'Person',
   *   avatar: 'http://lorempixel.com/400/400/',
   *   orgId: 'Tm90aGluZyB0byBzZWUgaGVyZS4uLiBNb3ZlIGFsb25nLi4u',
   *   roles: ['Tm90aGluZyB0byBzZWUgaGVyZS4uLiBNb3ZlIGFsb25nLi4u'],
   *   licenses: ['Tm90aGluZyB0byBzZWUgaGVyZS4uLiBNb3ZlIGFsb25nLi4u']
   * };
   *
   * spark.personAdd(newPerson)
   *   .then(function(person) {
   *     console.log(person.displayName);
   *   })
   *   .catch(function(err) {
   *     // process error
   *     console.log(err);
   *   });
   */
  Spark.personAdd = function(person) {
   // if person object is valid
   if(person && typeof person === 'object' && validator.isPerson(person)) {
     // add person
     return Spark.request('post', 'people', person);
   }

   // else, invalid arguments
   else {
     return when.reject(new Error('invalid or missing person object'));
   }
  };

  /**
   * Update a Person.
   *
   * @function
   * @param {Object.<Person>} person - Spark Person Object
   * @returns {Promise.<Person>} Person
   *
   * @example
   * spark.personGet('Tm90aGluZyB0byBzZWUgaGVyZS4uLiBNb3ZlIGFsb25nLi4u')
   *   .then(function(person) {
   *     // change value of retrieved person object
   *     person.displayName = 'Another Person';
   *     return spark.personUpdate(person);
   *   )
   *   .then(function(person) {
   *     console.log(person.displayName);
   *   })
   *   .catch(function(err) {
   *     // process error
   *     console.log(err);
   *   });
   */
  Spark.personUpdate = function(person) {
   // if person object is valid
   if(person && typeof person === 'object' && validator.isPerson(person)) {
     // update the person
     return Spark.request('put', 'people', person.id, person);
   }

   // else, invalid arguments
   else {
     return when.reject(new Error('invalid or missing person object'));
   }
  };

  /**
   * Remove Spark Person by ID.
   *
   * @function
   * @param {String} personId - Spark Person ID
   * @returns {Promise}
   *
   * @example
   * spark.personRemove('Tm90aGluZyB0byBzZWUgaGVyZS4uLiBNb3ZlIGFsb25nLi4u')
   *   .then(function() {
   *     console.log('Person removed.');
   *   })
   *   .catch(function(err) {
   *     // process error
   *     console.log(err);
   *   });
   */
  Spark.personRemove = function(personId) {
   return Spark.request('delete', 'people', personId)
     .then(res => when(true));
  };

  // return the Spark Object
  return Spark;
};
