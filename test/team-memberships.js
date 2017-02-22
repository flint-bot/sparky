'use strict';

const assert = require('assert');
const when = require('when');
const Spark = require('../');
const validator = require('../validator');

let spark;

if(typeof process.env.TOKEN === 'string') {
  spark = new Spark({token: process.env.TOKEN});

  describe('#Spark.teamMembershipsGet(teamId)', function() {
    it('returns an array of spark membership objects', function() {
      // skip teamMembershipsGet if TEAM_ID is not defined
      if(typeof process.env.TEAM_ID !== 'string') {
        this.skip();
      } else {
        return spark.teamMembershipsGet(process.env.TEAM_ID)
          .then(function(teamMemberships) {
            return when(assert(validator.isTeamMemberships(teamMemberships), 'invalid response'));
          });
      }
    });
  });
}
