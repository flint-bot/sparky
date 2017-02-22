'use strict';

const assert = require('assert');
const when = require('when');
const Spark = require('../');
const validator = require('../validator');

let spark;
let personMemberships;

if(typeof process.env.TOKEN === 'string') {
  spark = new Spark({token: process.env.TOKEN});

  describe('#Spark.membershipsGet()', function() {
    it('returns an array of spark membership objects', function() {
      return spark.membershipsGet()
        .then(function(memberships) {
          personMemberships = memberships;
          return when(assert(validator.isMemberships(memberships), 'invalid response'));
        });
    });
  });

  describe('#Spark.membershipGet(membershipId)', function() {
    it('returns a spark membership object', function() {
      // skip membershipGet if personMemberships is not defined
      if(!(personMemberships instanceof Array && personMemberships.length > 0)) {
        this.skip();
      } else {
        return spark.membershipGet(personMemberships[0].id)
          .then(function(membership) {
            return when(assert(validator.isMembership(membership), 'invalid response'));
          });
      }
    });
  });
}
