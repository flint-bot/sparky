const assert = require('assert');
const when = require('when');
const Spark = require('../');
const validator = require('../validator');

if (typeof process.env.SPARKY_API_TOKEN === 'string') {
  const spark = new Spark({ token: process.env.SPARKY_API_TOKEN });

  describe('#Spark.personMe()', () => {
    it('returns spark person object of authenticated account', () => spark.personMe()
      .then(person => when(assert(validator.isPerson(person), 'invalid response'))));
  });
}
