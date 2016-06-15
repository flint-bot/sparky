var assert = require('assert');

var Bottleneck = require('bottleneck');
var when = require('when');

var Spark = require('../lib/spark');

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

// spark items validators
Test.prototype.isRoom = function(room) {
  if(room instanceof Array) room = room[0];
  var result = (typeof room === 'object'
    && room.id && typeof room.id === 'string'
    && room.title && typeof room.title === 'string'
    && room.created && typeof room.created === 'string'
  );
  return result;
};

Test.prototype.isPerson = function(person) {
  if(person instanceof Array) person = person[0];
  var result = (typeof person === 'object'
    && person.id && typeof person.id === 'string'
    && person.displayName && typeof person.displayName === 'string'
    && person.created && typeof person.created === 'string'
    && person.avatar && typeof person.avatar === 'string'
    && person.emails 
  );
  return result;
};

Test.prototype.isMessage = function(message) {
  if(message instanceof Array) message = message[0];
  var result = (typeof message === 'object'
    && message.id && typeof message.id === 'string'
    && message.personId && typeof message.personId === 'string'
    && message.personEmail && typeof message.personEmail === 'string'
    && message.created && typeof message.created === 'string'
    && (message.text && typeof message.text === 'string' 
      || message.files && message.files instanceof Array)
  );
  return result;
};

Test.prototype.isMembership = function(membership) {
  if(membership instanceof Array) membership = membership[0];
  var result = (typeof membership === 'object'
    && membership.id && typeof membership.id === 'string'
    && membership.personId && typeof membership.personId === 'string'
    && membership.personEmail && typeof membership.personEmail === 'string'
    && membership.created && typeof membership.created === 'string'
  );
  return result;
};

Test.prototype.isWebhook = function(webhook) {
  if(webhook instanceof Array) webhook = webhook[0];
  var result = (typeof webhook === 'object'
    && webhook.id && typeof webhook.id === 'string'
    && webhook.name && typeof webhook.name === 'string'
    && webhook.targetUrl && typeof webhook.targetUrl === 'string'
    && webhook.resource && typeof webhook.resource === 'string'
    && webhook.event && typeof webhook.event === 'string'
    && webhook.filter && typeof webhook.filter === 'string'
  );
  return result;
};

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
        return when(result);
      }

      // check for array in returned promise, check first result
      else if(result instanceof Array && result.length > 0) {
        return when(test(result));
      } 

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

  it('spark.roomsGet', done => {
    test.spark('roomsGet', test.isRoom)
      .then(testpassed => {
        assert(testpassed);
        done();
      });
  });

  it('spark.roomGet', done => {
    test.spark('roomGet', test.isRoom, test.lastResult[0].id)
      .then(testpassed => {
        assert(testpassed);
        done();
      });
  });

  it('spark.roomAdd',  done => {
    test.spark('roomAdd', test.isRoom, 'Test Room')
      .then(testpassed => {
        assert(testpassed);
        done();
      });
  });

  it('spark.roomRename', done => {
    test.spark('roomRename', test.isRoom, test.lastResult.id, 'Test Room 2')
      .then(testpassed => {
        assert(testpassed);
        done();
      });
  });

  it('spark.roomRemove', done => {
    test.spark('roomRemove', test.isRoom, test.lastResult.id)
      .then(testpassed => {
        assert(testpassed);
        done();
      });
  });
  
  // person

  it('spark.personMe', done => {
    test.spark('personMe', test.isPerson)
      .then(testpassed => {
        assert(testpassed);
        done();
      });
  });

  it('spark.personGet', done => {
    test.spark('personGet', test.isPerson, test.lastResult.id)
      .then(testpassed => {
        assert(testpassed);
        done();
      });
  });

  if(personEmail) {
    it('spark.personByEmail', done => {
      test.spark('personByEmail', test.isPerson, personEmail)
        .then(testpassed => {
          assert(testpassed);
          done();
        });
     });
  }
      
  // messages

  it('spark.messagesGet', done => {
    spark.roomsGet().then(rooms => {
      test.spark('messagesGet', test.isMessage, rooms[0].id)
        .then(testpassed => {
          assert(testpassed);
          done();
        });
    });
  });   

  it('spark.messageGet', done => {
    test.spark('messageGet', test.isMessage, test.lastResult[0].id)
      .then(testpassed => {
        assert(testpassed);
        done();
      });
  });
  
  // memberships

  it('spark.membershipsGet', done => {
    test.spark('membershipsGet', test.isMembership)
      .then(testpassed => {
        assert(testpassed);
        done();
      });
  });

  it('spark.membershipGet', done => {
    test.spark('membershipGet', test.isMembership, test.lastResult[0].id)
      .then(testpassed => {
        assert(testpassed);
        done();
      });
  });

  // webhooks

  it('spark.webhookAdd', done => {
    spark.roomsGet().then(rooms => {
      test.spark('webhookAdd', test.isWebhook, 'messages', 'created', 'mywebhook', rooms[0].id)
        .then(testpassed => {
          assert(testpassed);
          done();
        });
    });
  });

  it('spark.webhookGet', done => {
    test.spark('webhookGet', test.isWebhook, test.lastResult.id)
      .then(testpassed => {
        assert(testpassed);
        done();
      });
  });

  it('spark.webhooksGet', done => {
    test.spark('webhooksGet', test.isWebhook)
      .then(testpassed => {
        assert(testpassed);
        done();
      });
  });

  it('spark.webhookRemove', done => {
    test.spark('webhookRemove', test.isWebhook, test.lastResult[0].id)
      .then(testpassed => {
        assert(testpassed);
        done();
      });
  });

});
