var assert = require('assert');
var util = require("util");

var Bottleneck = require('bottleneck');
var async = require('async');
var _ = require('lodash');

var Sparky = require('../lib/sparky');

var sparkyOptions = {
  token: process.env.TOKEN, 
  webhook: process.env.WEBHOOK_URL || 'http://bogus.com',
  minTime: 2000,
  maxConcurrent: 1
};

if(!sparkyOptions.token) throw new Error('token not specified');

// used in tests
var imageUrl = process.env.IMAGE_URL || 'https://en.wikipedia.org/wiki/T.A.P.O.A.F.O.M.#/media/File:MP_Clinton-TAPOAFOM.jpg';
var personEmail = process.env.EMAIL || null;

// config sparky
var sparky = new Sparky(sparkyOptions);

function Test() {
  var self = this;

  self.rooms = [];
  self.room = {};
  self.people = [];
  self.person = {};
  self.messages = [];
  self.message = {};
  self.memberships = [];
  self.membership = {};
  self.webhooks = [];
  self.webhook = {};
}

// spark response validators
Test.prototype.isRoom = function(room) {
  var result = (typeof room === 'object'
    && room.id && typeof room.id === 'string'
    && room.title && typeof room.title === 'string'
    && room.created && typeof room.created === 'string'
  );
  return result;
}
Test.prototype.isPerson = function(person) {
  var result = (typeof person === 'object'
    && person.id && typeof person.id === 'string'
    && person.displayName && typeof person.displayName === 'string'
    && person.created && typeof person.created === 'string'
    && person.avatar && typeof person.avatar === 'string'
    && person.emails 
  );
  return result;
}
Test.prototype.isMessage = function(message) {
  var result = (typeof message === 'object'
    && message.id && typeof message.id === 'string'
    && message.personId && typeof message.personId === 'string'
    && message.personEmail && typeof message.personEmail === 'string'
    && message.created && typeof message.created === 'string'
    && (message.text && typeof message.text === 'string' 
      || message.files && typeof message.files instanceof Array)
  );
  return result;
}
Test.prototype.isMembership = function(membership) {
  var result = (typeof membership === 'object'
    && membership.id && typeof membership.id === 'string'
    && membership.personId && typeof membership.personId === 'string'
    && membership.personEmail && typeof membership.personEmail === 'string'
    && membership.created && typeof membership.created === 'string'
  );
  return result;
}
Test.prototype.isWebhook = function(webhook) {
  var result = (typeof webhook === 'object'
    && webhook.id && typeof webhook.id === 'string'
    && webhook.name && typeof webhook.name === 'string'
    && webhook.targetUrl && typeof webhook.targetUrl === 'string'
    && webhook.resource && typeof webhook.resource === 'string'
    && webhook.event && typeof webhook.event === 'string'
    && webhook.filter && typeof webhook.filter === 'string'
  );
  return result;
}
Test.prototype.isRemoved = function(err) {
  if(!err) {
    return true;
  } else {
    return false;
  }
}
Test.prototype.sparky = function(type, cmd, test, options, cb) {
  var self = this;

  // parse args
  var args = Array.prototype.slice.call(arguments);
  type = args.shift();
  cmd = args.shift();
  test = args.shift();
  cb = args.pop();
  options = args.length > 0 ? args : [];

  // sparky callback
  options.push(function(err, response) {
    var result = false;
    if(!err && response && response instanceof Array) {
      self[type] = response;
      result = test(response[0]);
    } else if(cmd === 'remove') {
      result = test(err);
    }
    cb(err, result);
  });

  sparky[type][cmd].apply(null, options);
}
var test = new Test();

// Test Sparky Constructor
describe('Sparky', function() {

  // constructor
  it('return instance of Sparky', function(done) {
    var result = sparky instanceof Sparky;
    assert.equal(result, true, 'did not return instanceof Sparky');
    done();
  });

  // queue
  it('return a queue object for "queue"', function(done) {
    var result = sparky.queue instanceof Bottleneck;
    assert.equal(result, true, 'did not return queue object');
    done();
  });

  // requeue
  it('return a queue object for "requeue"', function(done) {
    var result = sparky.requeue instanceof Bottleneck;
    assert.equal(result, true, 'did not return queue object');
    done();
  });

});

// Test Sparky Functions
describe('Sparky functions', function() {
  // set default timeout
  this.timeout(10 * 1000);

  it('rooms.get', function(done) {
    test.sparky('rooms', 'get', test.isRoom, function(err, result) {
      assert(!err && result);
      done();
    });
  });

  it('room.get', function(done) {
    test.sparky('room', 'get', test.isRoom, test.rooms[0].id, function(err, result) {
      assert(!err && result);
      done();
    });
  });

  it('messages.get', function(done) {
    test.sparky('messages', 'get', test.isMessage, test.room[0].id, function(err, result) {
      assert(!err && result);
      done();
    });
  });

  it('person.me', function(done) {
    test.sparky('person', 'me', test.isPerson, function(err, result) {
      assert(!err && result);
      done();
    });
  });

  it('memberships.get', function(done) {
    test.sparky('memberships', 'get', test.isMembership, function(err, result) {
      assert(!err && result);
      done();
    });
  });

  it('membership.get', function(done) {
    test.sparky('membership', 'get', test.isMembership, test.memberships[0].id, function(err, result) {
      assert(!err && result);
      done();
    });
  });

  it('webhooks.get', function(done) {
    test.sparky('webhooks', 'get', test.isWebhook, function(err, result) {
      assert(!err && result);
      done();
    });
  });

  it('webhook.get', function(done) {
    test.sparky('webhook', 'get', test.isWebhook, test.webhooks[0].id, function(err, result) {
      assert(!err && result);
      done();
    });
  });

});
