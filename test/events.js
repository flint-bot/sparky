const assert = require('assert');
const when = require('when');
const Spark = require('../');
const validator = require('../validator');

let orgEvents;

if (typeof process.env.TOKEN === 'string') {
  const spark = new Spark({ token: process.env.TOKEN });

  describe('#Spark.eventsGet()', () => {
    it('returns an array of spark event objects', () => spark.eventsGet(10)
      .then((events) => {
        orgEvents = events;
        return when(assert(validator.isEvents(events), 'invalid response'));
      }));
  });

  describe('#Spark.eventGet(eventId)', () => {
    it('returns spark event object', () => {
      if (!(orgEvents instanceof Array && orgEvents.length > 0)) {
        this.skip();
        return when.reject(new Error('org events not found'));
      }
      return spark.eventGet(orgEvents[0].id)
        .then(event => when(assert(validator.isEvent(event), 'invalid response')));
    });
  });
}
