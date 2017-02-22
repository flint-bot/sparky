'use strict';

const assert = require('assert');
const when = require('when');
const Spark = require('../');
const validator = require('../validator');

let spark;

if(typeof process.env.TOKEN === 'string') {
  spark = new Spark({token: process.env.TOKEN});

  describe('#Spark.organizationsGet()', function() {
    it('returns an array of spark organization objects', function() {
      return spark.organizationsGet()
        .then(function(organizations) {
          return when(assert(validator.isOrganizations(organizations), 'invalid response'));
        });
    });
  });
}
