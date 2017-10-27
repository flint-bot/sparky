const assert = require('assert');
const when = require('when');
const Spark = require('../');
const validator = require('../validator');

let spark;
let newRoom;
let personRooms;

if (typeof process.env.TOKEN === 'string') {
  spark = new Spark({ token: process.env.TOKEN });

  describe('#Spark.roomsGet()', () => {
    it('returns an array of spark room objects', () => spark.roomsGet()
      .then((rooms) => {
        personRooms = rooms;
        return when(assert(validator.isRooms(rooms), 'invalid response'));
      }));
  });

  describe('#Spark.roomsGet({type: "direct"})', () => {
    it('returns an array of spark room objects', () => spark.roomsGet({ type: 'direct' })
      .then(rooms => when(assert(validator.isRooms(rooms), 'invalid response'))));
  });

  describe('#Spark.roomsGet({type: "group"})', () => {
    it('returns an array of spark room objects', () => spark.roomsGet({ type: 'group' })
      .then(rooms => when(assert(validator.isRooms(rooms), 'invalid response'))));
  });

  describe('#Spark.roomGet(roomId)', () => {
    it('returns a spark room object', () => {
      // skip roomGet if personRooms is not defined
      if (!(personRooms instanceof Array && personRooms.length > 0)) {
        this.skip();
        return when.reject(new Error('dependent test failed'));
      }
      return spark.roomGet(personRooms[0].id)
        .then(room => when(assert(validator.isRoom(room), 'invalid response')));
    });
  });

  describe('#Spark.roomAdd()', () => {
    it('returns a spark room object', () => spark.roomAdd('! node-sparky roomAdd() test :: (safe to delete)')
      .then((room) => {
        newRoom = validator.isRoom(room) ? room : false;
        return when(assert(validator.isRoom(room), 'invalid response'));
      }));
  });

  describe('#Spark.roomUpdate()', () => {
    it('returns a spark room object', () => {
      // skip roomUpdate if newRoomId is not set (happens if previous test fails)
      if (!newRoom) {
        this.skip();
        return when.reject(new Error('dependent test failed'));
      }
      newRoom.title = '! node-sparky roomUpdate() test :: (safe to delete)';
      return spark.roomUpdate(newRoom)
        .then(room => when(assert((validator.isRoom(room) && newRoom.title === room.title), 'invalid response')));
    });
  });

  describe('#Spark.roomRemove()', () => {
    it('returns a successful response', () => {
      // skip roomRemove if newRoomId is not set (happens if previous test fails)
      if (!newRoom) {
        this.skip();
        return when.reject(new Error('dependent test failed'));
      }
      return spark.roomRemove(newRoom.id)
        .then(ok => when(assert(ok, 'invalid response')));
    });
  });
}
