const assert = require('assert');
const when = require('when');
const Spark = require('../');
const validator = require('../validator');

if (typeof process.env.TOKEN === 'string') {
  const spark = new Spark({ token: process.env.TOKEN });

  describe('#Spark.teamMembershipsGet(teamId)', () => {
    it('returns an array of spark membership objects', () => spark.teamsGet(5)
      .then((teams) => {
        if (teams && teams instanceof Array && teams.length > 0) {
          return when(teams[0].id);
        }
        return when.reject(new Error('No teams found for user token'));
      })
      .then(teamId => spark.teamMembershipsGet(teamId))
      .then(teamMemberships => when(assert(validator.isTeamMemberships(teamMemberships), 'invalid response'))));
  });
}
