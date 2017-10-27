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
      return spark.teamsGet(5)
        .then((teams) => {
          if (teams && teams instanceof Array && teams.length > 0) {
            return when(teams[0].id);
          } else {
            return when.reject(new Error('No teams found for user token'));
          }
        })
        .then(teamId => spark.teamMembershipsGet(teamId))
        .then((teamMemberships) => {
          return when(assert(validator.isTeamMemberships(teamMemberships), 'invalid response'));
        });
    });
  });
}
