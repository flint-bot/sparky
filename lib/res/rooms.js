'use strict';

const when = require('when');

const validator = require('../validator');

/**
 * Room Object
 *
 * @namespace Room
 * @property {String} id - Room ID
 * @property {String} title - Room Title
 * @property {String} type - Room Type
 * @property {Boolean} isLocked - Room Moderated/Locked
 * @property {String} teamId - Team ID
 * @property {Date} lastActivity - Last Activity in Room
 * @property {Date} creatorId - person ID of Room creator
 * @property {Date} created - Room Created
 */

module.exports = function(Spark) {

  /**
   * Returns Spark Room Objects. If roomSearch argument is not passed, returns all Spark Rooms that the authenticated account is in. If 'max' is not specifed, returns all.
   *
   * @function
   * @param {Object.<RoomSearch>} [roomSearch] - Spark Person Search Object (optional)
   * @param {Integer} [max] - Number of records to return (optional)
   * @returns {Promise.Array.<Room>} Rooms Collection
   *
   * @example
   * spark.roomsGet({ type: 'group' }, 10)
   *   .then(function(rooms) {
   *     // process rooms as array
   *     rooms.forEach(function(room) {
   *       console.log(room.title);
   *     });
   *   })
   *   .catch(function(err) {
   *     // process error
   *     console.log(err);
   *   });
   */
  Spark.roomsGet = function(roomSearch, maxResults) {
    let args = Array.prototype.slice.call(arguments);
    roomSearch = args.length > 0 && typeof args[0] === 'object' ? args.shift() : {};
    maxResults = args.length > 0 && typeof args[0] === 'number' ? args.shift() : undefined;

    // if room search object is invalid
    if(!validator.isRoomSearch(roomSearch)) {
      roomSearch = {};
    }

    roomSearch.max = Spark.maxPageItems;

    return Spark.request('get', 'rooms', roomSearch, maxResults);
  };

  /**
   * Returns a Spark Room Object specified by Room ID.
   *
   * @function
   * @param {String} roomId - Spark Room ID
   * @returns {Promise.<Room>} Room
   *
   * @example
   * spark.roomGet('Tm90aGluZyB0byBzZWUgaGVyZS4uLiBNb3ZlIGFsb25nLi4u')
   *   .then(function(room) {
   *     console.log(room.title);
   *   })
   *   .catch(function(err) {
   *     // process error
   *     console.log(err);
   *   });
   */
  Spark.roomGet = function(roomId) {
    return Spark.request('get', 'rooms', roomId);
  };

  /**
   * Add new Spark Room.
   *
   * @function
   * @param {String} title - Title for a new Room
   * @param {String} [teamId] - Team ID (optional)
   * @returns {Promise.<Room>} Room
   *
   * @example
   * spark.roomAdd('myroom')
   *   .then(function(room) {
   *     console.log(room.title);
   *   })
   *   .catch(function(err) {
   *     // process error
   *     console.log(err);
   *   });
   */
  Spark.roomAdd = function(title, teamId) {
    let room = { title: title };
    // if teamId is defined...
    if(typeof teamId === 'string') room.teamId = teamId;
    return Spark.request('post', 'rooms', room);
  };

  /**
   * Update a Spark Room.
   *
   * @function
   * @param {Object.<Room>} room - Spark Room Object
   * @returns {Promise.<Room>} Room
   *
   * @example
   * spark.roomGet(Tm90aGluZyB0byBzZWUgaGVyZS4uLiBNb3ZlIGFsb25nLi4u)
   *   .then(function(room) {
   *     // change value of retrieved room object
   *     room.title = 'Another Title';
   *     return spark.roomUpdate(room);
   *   )
   *   .then(function(room) {
   *     console.log(room.title);
   *   })
   *   .catch(function(err) {
   *     // process error
   *     console.log(err);
   *   });
   */
  Spark.roomUpdate = function(room) {
    // if room object is valid
    if(room && typeof room === 'object' && validator.isRoom(room)) {
      // update the room
      return Spark.request('put', 'rooms', room.id, room);
    }

    // else, invalid arguments
    else {
      return when.reject(new Error('invalid or missing room object'));
    }
  };

  /**
   * Remove Spark Room by ID.
   *
   * @function
   * @param {String} roomId - Spark Room ID
   * @returns {Promise}
   *
   * @example
   * spark.roomRemove('Tm90aGluZyB0byBzZWUgaGVyZS4uLiBNb3ZlIGFsb25nLi4u')
   *   .then(function() {
   *     console.log('Room removed.');
   *   })
   *   .catch(function(err) {
   *     // process error
   *     console.log(err);
   *   });
   */
  Spark.roomRemove = function(roomId) {
    return Spark.request('delete', 'rooms', roomId)
      .then(res => when(true));
  };

  // return the Spark Object
  return Spark;
};
