'use strict';

const assert = require('assert');
const when = require('when');
const Spark = require('../');
const validator = require('../validator');

let spark;

if(typeof process.env.TOKEN === 'string') {
  spark = new Spark({token: process.env.TOKEN});

  describe('#Spark.rolesGet()', function() {
    it('returns an array of spark role objects', function() {
      return spark.rolesGet()
        .then(function(roles) {
          return when(assert(validator.isRoles(roles), 'invalid response'));
        });
    });
  });
}
