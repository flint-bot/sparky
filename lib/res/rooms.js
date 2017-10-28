const when = require('when');
const validator = require('../validator');

/**
 * @description Room Object
 *
 * @namespace Room
 * @property {String} id - Room ID
 * @property {String} title - Room Title
 * @property {String} type - Room Type
 * @property {Boolean} isLocked - Room Moderated/Locked
 * @property {String} teamId - Team ID
 * @property {String} lastActivity - Last Activity in Room (ISO 8601)
 * @property {String} creatorId - person ID of Room creator (ISO 8601)
 * @property {String} created - Room Created (ISO 8601)
 */

const Rooms = (Spark) => {
  const rooms = {
    /**
     * @description Returns Spark Room Objects. If roomSearch argument is not
     * passed, returns all Spark Rooms that the authenticated account is in.
     * If 'max' is not specifed, returns all.
     *
     * @memberof Spark
     * @function
     * @param {Object.<RoomSearch>} [roomSearch] - Spark Person Search Object (optional)
     * @param {Integer} [max] Number of records to return (optional)
     * @returns {Promise.Array.<Room>} Array of Spark Room objects
     *
     * @example
     * spark.roomsGet({ type: 'group' }, 10)
     *   .then(rooms => rooms.forEach(room => console.log(room.title)))
     *   .catch(err => console.error(err));
     */
    roomsGet: (...args) => {
      let roomSearch = args.length > 0 && typeof args[0] === 'object' ? args.shift() : {};
      const maxResults = args.length > 0 && typeof args[0] === 'number' ? args.shift() : 0;
      if (!validator.isRoomSearch(roomSearch)) {
        roomSearch = {};
      }
      roomSearch.max = Spark.maxPageItems;
      return Spark.request('get', 'rooms', roomSearch, maxResults);
    },

    /**
     * @description Returns a Spark Room Object specified by Room ID.
     *
     * @memberof Spark
     * @function
     * @param {String} roomId Spark Room ID
     * @returns {Promise.<Room>} Spark Room object
     *
     * @example
     * spark.roomGet('Tm90aGluZyB0byBzZWUgaGVy')
     *   .then(room => console.log(room.title))
     *   .catch(err => console.error(err));
     */
    roomGet: (roomId) => {
      if (typeof roomId !== 'string') {
        return when.reject(new Error('invalid arguments'));
      }
      return Spark.request('get', 'rooms', roomId);
    },

    /**
     * @description Add new Spark Room.
     *
     * @memberof Spark
     * @function
     * @param {String} title Title for a new Room
     * @param {String} [teamId] Team ID (optional)
     * @returns {Promise.<Room>} Spark Room object
     *
     * @example
     * spark.roomAdd('myroom')
     *   .then(room => console.log(room.title))
     *   .catch(err => console.error(err));
     */
    roomAdd: (title, teamId) => {
      const room = { title };
      if (typeof teamId === 'string') {
        room.teamId = teamId;
      }
      return Spark.request('post', 'rooms', room);
    },

    /**
     * @description Update a Spark Room.
     *
     * @memberof Spark
     * @function
     * @param {Object.<Room>} room Spark Room object
     * @returns {Promise.<Room>} Spark Room object
     *
     * @example
     * spark.roomGet(Tm90aGluZyB0byBzZWUgaGVy)
     *   .then((room) => {
     *     room.title = 'Another Title';
     *     return spark.roomUpdate(room);
     *   )
     *   .then(room => console.log(room.title))
     *   .catch(err => console.error(err));
     */
    roomUpdate: (room) => {
      if (room && typeof room === 'object' && validator.isRoom(room)) {
        return Spark.request('put', 'rooms', room.id, room);
      }
      return when.reject(new Error('invalid or missing room object'));
    },

    /**
     * @description Remove Spark Room by ID.
     *
     * @memberof Spark
     * @function
     * @param {String} roomId - Spark Room ID
     * @returns {Promise} Fulfilled promise
     *
     * @example
     * spark.roomRemove('Tm90aGluZyB0byBzZWUgaGVy')
     *   .then(() => console.log('Room removed.'))
     *   .catch(err => console.error(err));
     */
    roomRemove: (roomId) => {
      if (typeof roomId !== 'string') {
        return when.reject(new Error('invalid arguments'));
      }
      return Spark.request('delete', 'rooms', roomId);
    },
  };

  return rooms;
};

module.exports = Rooms;
