const when = require('when');
const validator = require('../validator');

/**
 * @description Event Object
 *
 * @namespace Event
 * @property {String} id - Event ID
 * @property {String} resource - Event resource
 * @property {String} type - Event type
 * @property {String} actorId - Person ID that triggered event
 * @property {String} orgId - Organzation ID that event occurred in
 * @property {String} appId - Application ID
 * @property {String} created - Date Event created (ISO 8601)
 * @property {Object} data - Event data object
 */

const Events = (Spark) => {
  const events = {
    /**
     * @description List events in your organization. Several query parameters
     * are available to filter the response. Long result sets will be split
     * into pages. Requires admin permissions in organization.
     *
     * @memberof Spark
     * @function
     * @param {Object} [eventSearch] Spark Event Search Object
     * @param {Integer} [max] Number of records to return (optional)
     * @returns {Promise.Array.<Event>} Events Collection
     *
     * @example
     * spark.eventsGet({ resource: 'messages' }, 10)
     *   .then(events => events.forEach(event => console.log(event.data.text)))
     *   .catch(err => console.error(err));
     */
    eventsGet: (...args) => {
      const eventSearch = args.length > 0 && typeof args[0] === 'object' ? args.shift() : {};
      const maxResults = args.length > 0 && typeof args[0] === 'number' ? args.shift() : 0;

      if (!validator.isEventSearch(eventSearch)) {
        return when.reject(new Error('invalid search'));
      }
      eventSearch.max = Spark.maxPageItems;
      return Spark.request('get', 'events', eventSearch, maxResults);
    },

    /**
     * @description Return details of Spark Event by ID.
     *
     * @memberof Spark
     * @function
     * @param {String} eventId Spark Event ID
     * @returns {Promise.<Event>} Spark Event object
     *
     * @example
     * spark.eventGet('Tm90aGluZyB0byBzZWUgaGVy')
     *   .then(event => console.log(event.data.text))
     *   .catch(err => console.error(err));
     */
    eventGet: (eventId) => {
      if (typeof eventId !== 'string') {
        return when.reject(new Error('invalid arguments'));
      }
      return Spark.request('get', 'events', eventId);
    },
  };

  return events;
};

module.exports = Events;
