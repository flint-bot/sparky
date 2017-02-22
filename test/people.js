'use strict';

const assert = require('assert');
const when = require('when');
const Spark = require('../');
const validator = require('../validator');

let spark;

if(typeof process.env.TOKEN === 'string') {
  spark = new Spark({token: process.env.TOKEN});

  describe('#Spark.personMe()', function() {
    it('returns spark person object of authenticated account', function() {
      return spark.personMe()
        .then(function(person) {
          return when(assert(validator.isPerson(person), 'invalid response'));
        });
    });
  });
}
