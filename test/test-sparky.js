var assert = require('assert');
var util = require("util");

var Bottleneck = require('bottleneck');
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
var imageUrl = process.env.IMAGE_URL || 'https://upload.wikimedia.org/wikipedia/en/a/a0/MP_Clinton-TAPOAFOM.jpg';
var personEmail = process.env.EMAIL || null;
var personDisplayName = process.env.DISPLAY_NAME || null;

// config sparky
var sparky = new Sparky(sparkyOptions);

// create alias functions
sparky.message.sendRoom = sparky.message.send.room;
sparky.message.sendPerson = sparky.message.send.person;
sparky.membership.setModerator = sparky.membership.set.moderator
sparky.membership.clearModerator = sparky.membership.clear.moderator;
sparky.webhook.addRoom = sparky.webhook.add.messages.created.room;

function Test() {
  var self = this;
  self.rooms = [];
  self.room = [];
  self.people = [];
  self.person = [];
  self.messages = [];
  self.message = [];
  self.memberships = [];
  self.membership = [];
  self.webhooks = [];
  self.webhook = [];
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
}
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
}
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
}
Test.prototype.isMembership = function(membership) {
  if(membership instanceof Array) membership = membership[0];
  var result = (typeof membership === 'object'
    && membership.id && typeof membership.id === 'string'
    && membership.personId && typeof membership.personId === 'string'
    && membership.personEmail && typeof membership.personEmail === 'string'
    && membership.created && typeof membership.created === 'string'
  );
  return result;
}
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
  options.push(function(err, items) {
    var result = false;
    if(!err && items && items instanceof Array) {
      if(items.length > 0) {
        // populated result array, validate content
        self[type] = items;
        result = test(items);
      } else {
        // empty result array, do not validate content
        result = true;
      }
    } else if(cmd === 'remove') {
      // remove action return sucess, but no object(s)
      result = true;
    }
    cb(err, result);
  });

  sparky[type][cmd].apply(null, options);
}
var test = new Test();

// Test Sparky Constructor
describe('Sparky Constructor', function() {

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
  this.timeout(30 * 1000);

  // rooms

  it('sparky.rooms.get', function(done) {
    test.sparky('rooms', 'get', test.isRoom, function(err, result) {
      assert(!err && result);
      done();
    });
  });

  // room

  it('sparky.room.get', function(done) {
    test.sparky('room', 'get', test.isRoom, test.rooms[0].id, function(err, result) {
      assert(!err && result);
      done();
    });
  });

  it('sparky.room.add', function(done) {
    test.sparky('room', 'add', test.isRoom, 'Test Room', function(err, result) {
      assert(!err && result);
      done();
    });
  });

  it('sparky.room.rename', function(done) {
    test.sparky('room', 'rename', test.isRoom, test.room[0].id, 'Test Room 2', function(err, result) {
      assert(!err && result);
      done();
    });
  });

  it('sparky.room.remove', function(done) {
    test.sparky('room', 'remove', test.isRoom, test.room[0].id, function(err, result) {
      assert(!err && result);
      done();
    });
  });

  // people

  if(personDisplayName) { // requires organization
    it('sparky.people.search', function(done) {
      test.sparky('people', 'search', test.isPerson, personDisplayName, function(err, result) {
        assert(!err && result);
        done();
      });
    });
  }
  
  // person

  it('sparky.person.me', function(done) {
    test.sparky('person', 'me', test.isPerson, function(err, result) {
      assert(!err && result);
      done();
    });
  });

  it('sparky.person.get', function(done) {
    test.sparky('person', 'get', test.isPerson, test.person[0].id, function(err, result) {
      assert(!err && result);
      done();
    });
  });

  if(personEmail) {
    it('sparky.person.byEmail', function(done) {
      test.sparky('person', 'byEmail', test.isPerson, personEmail, function(err, result) {
        assert(!err && result);
        done();
      });
    });
  }
  
  // messages

  it('sparky.messages.get', function(done) {
    test.sparky('messages', 'get', test.isMessage, test.rooms[0].id, function(err, result) {
      assert(!err && result);
      done();
    });
  });

  // message

  it('sparky.message.get', function(done) {
    test.sparky('message', 'get', test.isMessage, test.messages[0].id, function(err, result) {
      assert(!err && result);
      done();
    });
  });
  
  // memberships

  it('sparky.memberships.get', function(done) {
    test.sparky('memberships', 'get', test.isMembership, function(err, result) {
      assert(!err && result);
      done();
    });
  });

  // membership

  it('sparky.membership.get', function(done) {
    test.sparky('membership', 'get', test.isMembership, test.memberships[0].id, function(err, result) {
      assert(!err && result);
      done();
    });
  });

  // webhooks

  it('sparky.webhooks.get', function(done) {
    test.sparky('webhooks', 'get', test.isWebhook, function(err, result) {
      assert(!err && result);
      done();
    });
  });

  // webhook

  it('sparky.webhook.add.messages.created.room', function(done) {
    test.sparky('webhook', 'addRoom', test.isWebhook, test.rooms[0].id, 'Test Webhook', function(err, result) {
      assert(!err && result);
      done();
    });
  });

  it('sparky.webhook.get', function(done) {
    test.sparky('webhook', 'get', test.isWebhook, test.webhook[0].id, function(err, result) {
      assert(!err && result);
      done();
    });
  });

  it('sparky.webhook.remove', function(done) {
    test.sparky('webhook', 'remove', test.isWebhook, test.webhook[0].id, function(err, result) {
      assert(!err && result);
      done();
    });
  });

});
