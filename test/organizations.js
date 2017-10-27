const assert = require('assert');
const when = require('when');
const Spark = require('../');
const validator = require('../validator');

if (typeof process.env.TOKEN === 'string') {
  const spark = new Spark({ token: process.env.TOKEN });

  describe('#Spark.organizationsGet()', () => {
    it('returns an array of spark organization objects', () => spark.organizationsGet()
      .then(organizations => when(assert(validator.isOrganizations(organizations), 'invalid response'))));
  });
}
