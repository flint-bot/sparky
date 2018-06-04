const assert = require('assert');
const when = require('when');
const Spark = require('../');
const validator = require('../validator');

if (typeof process.env.SPARKY_API_TOKEN === 'string') {
  const spark = new Spark({ token: process.env.SPARKY_API_TOKEN });

  describe('#Spark.teamsGet()', () => {
    it('returns an array of spark team objects', () => spark.teamsGet()
      .then(teams => when(assert(validator.isTeams(teams), 'invalid response'))));
  });
}
