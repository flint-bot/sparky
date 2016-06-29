'use strict';

var assert = require('assert');

var Bottleneck = require('bottleneck');
var debug = require('debug')('spark');
var when = require('when');

var Spark = require('../lib/spark');
var u = require('../lib/utils');

var sparkOptions = {
  token: process.env.TOKEN,
  webhookUrl: process.env.WEBHOOK_URL || 'http://bogus.com',
  minTime: 600,
  maxConcurrent: 1
};

if(!sparkOptions.token) throw new Error('token not specified');

// used in tests
var personEmail = process.env.EMAIL || null;

// config spark
var spark = new Spark(sparkOptions);

function Test() {
  this.lastResult;
}

Test.prototype.spark = function(fn, test, options) {
  // parse args
  var args = Array.prototype.slice.call(arguments);
  fn = args.shift();
  test = args.shift();
  options = args.length > 0 ? args : [];

  return spark[fn].apply(spark, options)
    .then(result => {

      this.lastResult = result;

      //check for t/f in returned promise
      if(typeof result === 'boolean') {
        if(result) {
          return when(true);
        } else {
          return when(false);
        }
      }

      // check for array in returned promise, check first result
      else if(result instanceof Array && result.length > 0) {
        return when(test(result));
      }

      // check for object in returned promise
      else if(!(result instanceof Array) && typeof result === 'object') {
        return when(test(result));
      }

      else {
        return when(false);
      }
    })
    .catch(err => {
      return when(false);
    });
};


var test = new Test();

// Test Spark Constructor
describe('Spark Constructor', () =>  {

  // constructor
  it('return instance of Spark', done => {
    var result = spark instanceof Spark;
    assert.equal(result, true, 'did not return instanceof Spark');
    done();
  });

  // queue
  it('return a queue object for "queue"', done => {
    var result = spark.queue instanceof Bottleneck;
    assert.equal(result, true, 'did not return queue object');
    done();
  });

  // requeue
  it('return a queue object for "requeue"', done => {
    var result = spark.requeue instanceof Bottleneck;
    assert.equal(result, true, 'did not return queue object');
    done();
  });

});

// Test Spark Functions
describe('Spark functions', function() {
  // set default timeout
  this.timeout(30 * 1000);

  // rooms

  it('spark.roomsDirect', done => {
    test.spark('roomsDirect', u.isRoom)
      .then(testpassed => {
        assert(testpassed);
        done();
      });
  });

  it('spark.roomsGroup', done => {
    test.spark('roomsGroup', u.isRoom)
      .then(testpassed => {
        assert(testpassed);
        done();
      });
  });

  it('spark.roomsGet', done => {
    test.spark('roomsGet', u.isRoom)
      .then(testpassed => {
        assert(testpassed);
        done();
      });
  });

  it('spark.roomGet', done => {
    test.spark('roomGet', u.isRoom, test.lastResult[0].id)
      .then(testpassed => {
        assert(testpassed);
        done();
      });
  });

  it('spark.roomAdd',  done => {
    test.spark('roomAdd', u.isRoom, 'Test Room')
      .then(testpassed => {
        assert(testpassed);
        done();
      });
  });

  it('spark.roomRename', done => {
    test.spark('roomRename', u.isRoom, test.lastResult.id, 'Test Room 2')
      .then(testpassed => {
        assert(testpassed);
        done();
      });
  });

  it('spark.roomRemove', done => {
    test.spark('roomRemove', u.isRoom, test.lastResult.id)
      .then(testpassed => {
        assert(testpassed);
        done();
      });
  });

  // teams

  it('spark.teamsGet', done => {
    test.spark('teamsGet', u.isTeam)
      .then(testpassed => {
        assert(testpassed);
        done();
      });
  });

  it('spark.teamGet', done => {
    test.spark('teamGet', u.isTeam, test.lastResult[0].id)
      .then(testpassed => {
        assert(testpassed);
        done();
      });
  });

  it('spark.teamMembershipsGet', done => {
    test.spark('teamMembershipsGet', u.isMembership, test.lastResult.id)
      .then(testpassed => {
        assert(testpassed);
        done();
      });
  });

  it('spark.teamMembershipGet', done => {
    test.spark('teamMembershipGet', u.isMembership, test.lastResult[0].id)
      .then(testpassed => {
        assert(testpassed);
        done();
      });
  });

  it('spark.teamAdd', done => {
    test.spark('teamAdd', u.isTeam, 'myteam')
      .then(testpassed => {
        assert(testpassed);
        done();
      });
  });

  it('spark.teamRename', done => {
    test.spark('teamRename', u.isTeam, test.lastResult.id, 'myteam2')
      .then(testpassed => {
        assert(testpassed);
        done();
      });
  });

  it('spark.teamRemove', done => {
    test.spark('teamRemove', u.isTeam, test.lastResult.id)
      .then(testpassed => {
        assert(testpassed);
        done();
      });
  });

  it('spark.teamsGet', done => {
    test.spark('teamsGet', u.isTeam)
      .then(testpassed => {
        assert(testpassed);
        done();
      });
  });

  it('spark.roomsByTeam', done => {
    test.spark('roomsByTeam', u.isRoom, test.lastResult[0].id)
      .then(testpassed => {
        assert(testpassed);
        done();
      });
  });

  // person

  it('spark.personMe', done => {
    test.spark('personMe', u.isPerson)
      .then(testpassed => {
        assert(testpassed);
        done();
      });
  });

  it('spark.personGet', done => {
    test.spark('personGet', u.isPerson, test.lastResult.id)
      .then(testpassed => {
        assert(testpassed);
        done();
      });
  });

  if(personEmail) {
    it('spark.personByEmail', done => {
      test.spark('personByEmail', u.isPerson, personEmail)
        .then(testpassed => {
          assert(testpassed);
          done();
        });
     });
  }

  // messages

  it('spark.messagesGet', done => {
    spark.roomsGet().then(rooms => {
      test.spark('messagesGet', u.isMessage, rooms[0].id)
        .then(testpassed => {
          assert(testpassed);
          done();
        });
    });
  });

  it('spark.messageGet', done => {
    test.spark('messageGet', u.isMessage, test.lastResult[0].id)
      .then(testpassed => {
        assert(testpassed);
        done();
      });
  });

  // memberships

  it('spark.membershipsGet', done => {
    test.spark('membershipsGet', u.isMembership)
      .then(testpassed => {
        assert(testpassed);
        done();
      });
  });

  it('spark.membershipGet', done => {
    test.spark('membershipGet', u.isMembership, test.lastResult[0].id)
      .then(testpassed => {
        assert(testpassed);
        done();
      });
  });

  // webhooks

  it('spark.webhookAdd', done => {
    spark.roomsGet().then(rooms => {
      test.spark('webhookAdd', u.isWebhook, 'messages', 'created', 'mywebhook', rooms[0].id)
        .then(testpassed => {
          assert(testpassed);
          done();
        });
    });
  });

  it('spark.webhookGet', done => {
    test.spark('webhookGet', u.isWebhook, test.lastResult.id)
      .then(testpassed => {
        assert(testpassed);
        done();
      });
  });

  it('spark.webhooksGet', done => {
    test.spark('webhooksGet', u.isWebhook)
      .then(testpassed => {
        assert(testpassed);
        done();
      });
  });

  it('spark.webhookRemove', done => {
    test.spark('webhookRemove', u.isWebhook, test.lastResult[0].id)
      .then(testpassed => {
        assert(testpassed);
        done();
      });
  });

});
