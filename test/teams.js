'use strict';

const assert = require('assert');
const when = require('when');
const Spark = require('../');
const validator = require('../validator');

let spark;

if(typeof process.env.TOKEN === 'string') {
  spark = new Spark({token: process.env.TOKEN});

  describe('#Spark.teamsGet()', function() {
    it('returns an array of spark team objects', function() {
      return spark.teamsGet()
        .then(function(teams) {
          return when(assert(validator.isTeams(teams), 'invalid response'));
        });
    });
  });
}
