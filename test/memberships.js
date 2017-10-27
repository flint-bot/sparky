const assert = require('assert');
const when = require('when');
const Spark = require('../');
const validator = require('../validator');

let personMemberships;

if (typeof process.env.TOKEN === 'string') {
  const spark = new Spark({ token: process.env.TOKEN });

  describe('#Spark.membershipsGet()', () => {
    it('returns an array of spark membership objects', () => spark.membershipsGet()
      .then((memberships) => {
        personMemberships = memberships;
        return when(assert(validator.isMemberships(memberships), 'invalid response'));
      }));
  });

  describe('#Spark.membershipGet(membershipId)', () => {
    it('returns a spark membership object', () => {
      // skip membershipGet if personMemberships is not defined
      if (!(personMemberships instanceof Array && personMemberships.length > 0)) {
        this.skip();
        return when.reject(new Error('membership not found'));
      }
      return spark.membershipGet(personMemberships[0].id)
        .then(membership => when(assert(validator.isMembership(membership), 'invalid response')));
    });
  });
}
