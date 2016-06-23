/**
 * @file Defines SPARK Class
 * @author Nicholas Marus <nmarus@gmail.com>
 * @license LGPL-3.0
 */

'use strict';

var EventEmitter = require('events').EventEmitter;
var validator = require('validator');
var Bottleneck = require('bottleneck');
var debug = require('debug')('spark');
var util = require('util');
var when = require('when');
var req = require('request');
var _ = require('lodash');

/**
 *
 * Creates a Spark API instance that is then attached to a Spark Room.
 *
 * @constructor
 *
 * @param {Object} options
 * Configuration object containing Spark settings.
 *
 * @throw {Error} Throws on spark token missing in options object.
 *
 */
function Spark(options) {
  EventEmitter.call(this);

  this.options = options;

  // config defaults
  this.token = this.options.token || process.env.TOKEN || null;
  this.webhookUrl = this.options.webhookUrl || process.env.WEBHOOK_URL || null;
  this.maxPageItems = this.options.maxPageItems || 50;
  this.maxConcurrent = this.options.maxConcurrent || 3;
  this.minTime = this.options.minTime || 600;
  this.requeueMinTime = this.options.requeueMinTime || this.minTime * 10;
  this.requeueMaxRetry = this.options.requeueMaxRetry || 3;
  this.requeueCodes = this.options.requeueCodes || [ 429, 500, 503 ];
  this.requestTimeout = this.options.requestTimeout || 20000;
  this.queueSize = this.options.queueSize || 10000;
  this.requeueSize = this.options.requeueSize || 10000;

  // api url
  this.apiUrl = 'https://api.ciscospark.com/v1/';

  // queue for API calls
  this.queue = new Bottleneck(this.maxConcurrent, this.minTime, this.queueSize);
  this.queue.on('dropped', dropped => {
    debug('request dropped due to queue overflow');
    this.emit('dropped', dropped, this.id);
  });

  // queue for API calls that fail
  this.requeue = new Bottleneck(this.maxConcurrent, this.requeueMinTime, this.requeueSize);
  this.requeue.on('dropped', dropped => {
    debug('request dropped due to requeue overflow');
    this.emit('dropped', dropped, this.id);
  });

  // handle internal events
  this.on('error', err => {
    if(err) {
      debug(err.stack);
    }
  });
}
util.inherits(Spark, EventEmitter);

/**
 *
 * Format Spark API Call, make http request, and validate response
 *
 * @private
 *
 * @param {String} method
 * @param {String} resource
 * @param {id} id
 * @param {query} query
 *
 * @returns {Promise.<Response>}
 * Promise that resolves to Response object.
 *
 */
Spark.prototype.request = function(method, resource, id, query, maxResults) {
  
  if(!this.token) {
    return when.reject(new Error('token not defined'));
  }
  
  // parse args
  var args = Array.prototype.slice.call(arguments);
  method = args.shift();
  resource = args.shift();

  var url = this.apiUrl + resource;

  // add id to url if specified
  if(args.length > 0 && typeof args[0] === 'string') {
    url = url + '/' + args.shift();
  }

  // get query if specified
  if(args.length > 0 && typeof args[0] === 'object') {
    query = args.shift();
  }

  // get limit for items retrieved
  if(args.length > 0 && typeof args[0] === 'number') {
    maxResults = args.shift();
  }

  // headers
  var headers = {
    'Authorization': 'Bearer ' + this.token,
    'Content-Type': 'application/json'
  };

  // default request options
  var requestOptions = {
    url: url,
    headers: headers,
    method: method,
    timeout: this.requestTimeout,
    gzip: true,
    time: true,
    json: true
  };

  // update options for contents resource
  if(resource === 'contents') {
    requestOptions.encoding = 'binary';
    requestOptions.json = false;
  }

  // update options for query
  if(query) {
    if(method === 'post' || method === 'put') {
      // do body query
      requestOptions.body = query;
    } else {
      // do query string
      requestOptions.qs = query;
    }
  }

  // perform HTTP request and structure response
  function request(options) {
    return when.promise((resolve, reject) => {
      req(options, (err, res, body) => {
        if(err) {
          reject(err);
        } else {
          var response = {
            headers: res.headers || {},
            statusCode: res.statusCode || 0,
            code: res.statusCode || 0,
            body: body || res.body || {},
            ok: (res.statusCode >= 200 && res.statusCode < 300)
          };
          resolve(response);
        }
      });
    });
  }

  var errorCount = 0;

  var requestQueue = options => {
    // emit request event
    this.emit('request', options, this.id);

    return when(this.queue.schedule(request, options))
      .then(response => {
        this.emit('response', response, this.id);

        if(_.includes(this.requeueCodes, response.statusCode)) {
          return when(true).delay(this.requeueMinTime).then(() => requestRequeue(options));
        } else {
          return when(response);
        }
      });
  };

  var requestRequeue = options => {
    errorCount++;

    // emit request event
    this.emit('request', options, this.id);

    // emit retry event
    this.emit('retry', options, this.id);

    debug('Retry attempt #%s for (%s) %s', errorCount, options.method, options.url);

    return when(this.requeue.schedule(request, options))
      .then(response => {
        this.emit('response', response, this.id);

        if(errorCount >= this.requeueMaxRetry) {
          return when(response);
        }

        if(_.includes(this.requeueCodes, response.statusCode)) {
          return when(true).delay(this.requeueMinTime).then(() => requestRequeue(options));
        } else {
          return when(response);
        }
      });
  };

  // recursive pagination
  var requestPaginate = (items, link) => {

    // limit max results
    if(typeof maxResults === 'number' && items.length > maxResults) {
      items = items.slice(0, maxResults);
      return when(items);
    }

    var pageRequestOptions = _.clone(requestOptions);
    pageRequestOptions.url = link.match(/(http.*)>/)[1];

    // request next page
    return requestQueue(pageRequestOptions)
      .then(response => {

        // response 2XX
        if(response.ok) {

          // if more items returned...
          if(response.body && response.body.items) {

            // concat next page items with current items
            items = _.concat(items, response.body.items);

            // if pagination link found in next page response, get next page
            if(response.headers['link']) {
              return requestPaginate(items, response.headers['link']);
            }

            // no more pages, return items
            else {
              return when(items);
            }
          }
        }

        // response not ok, return items retrieved
        else {
          return when(items);
        }
      });
  };

  return requestQueue(requestOptions)
    .then(response => {

      // response 2XX
      if(response.ok) {

        // if pagination link found in response
        if(response.body && response.body.items && response.headers['link']) {
          return requestPaginate(response.body.items, response.headers['link'])
            .then(allItems => {
              response.body.items = allItems;
              return when(response);
            });
        }

        // return response
        else {
          // limit max results
          if(typeof maxResults === 'number' && response.body.items.length > maxResults) {
            response.body.items = response.body.items.slice(0, maxResults);
          }
          return when(response);
        }
      }

      // everything else
      else {
        var errorMessage = util.format('received response code %s for (%s) %s body:%j qs:%j', response.statusCode, requestOptions.method, requestOptions.url, requestOptions.body || {}, requestOptions.qs || {});
        debug(errorMessage);
        return when.reject(new Error(errorMessage));
      }
    });
};

/**
 *
 * Parse Spark API response to object.
 *
 * @private
 *
 * @param {Response} response
 * Spark API response.
 *
 * @returns {Promise.<Object>}
 * Promise fulfilled with Response object.
 *
 */
Spark.prototype.toObject = function(response) {
  // from array
  if(response && response.body && response.body.items instanceof Array) {
    if(response.body.items.length > 0) {
      return when(response.body.items[0]);
    } else {
      return when({});
    }
  }

  // from object
  else if(response && !response.body.items && response.body.id) {
    return when(response.body);
  }

  else {
    return when({});
  }
};

/**
 *
 * Parse Spark API response to array.
 *
 * @private
 *
 * @param {Response} response
 * Spark API response.
 *
 * @returns {Array}
 * Promise fulfilled with array of Response objects.
 *
 */
Spark.prototype.toArray = function(response) {
  // from array
  if(response && response.body && response.body.items instanceof Array) {
    if(response.body.items.length > 0) {
      return when(response.body.items);
    } else {
      return when([]);
    }
  }

  // from object
  else if(response && !response.body.items && response.body.id) {
    return when([response.body]);
  }

  else {
    return when([]);
  }
};

/**
 *
 * Return all Spark Rooms registered to account.
 *
 * @function
 *
 * @param {Integer} max
 * (optional, defaults to all items) Number of records to return.
 *
 * @returns {Promise.<Array>}
 * Promise fulfilled with array of Room objects.
 *
 * @example
 *
 * spark.roomsGet(10)
 *   .then(function(rooms) {
 *     // process rooms as array
 *     rooms.forEach(function(room) {
 *       console.log(room.title);
 *     });
 *   })
 *   .catch(function(err) {
 *     // process error
 *     console.log(err);
 *   });
 *
 */
Spark.prototype.roomsGet = function(maxResults) {
  return this.request('get', 'rooms', { max: this.maxPageItems }, maxResults)
    .then(res => this.toArray(res));
};

/**
 *
 * Return details of Spark Room by ID.
 *
 * @function
 *
 * @param {String} roomId
 * Spark Room ID.
 *
 * @returns {Promise.<Room>}
 * Promise fulfilled with Room object.
 *
 * @example
 *
 * spark.roomGet('Tm90aGluZyB0byBzZWUgaGVyZS4uLiBNb3ZlIGFsb25nLi4u')
 *   .then(function(room) {
 *     console.log(room.title);
 *   })
 *   .catch(function(err) {
 *     // process error
 *     console.log(err);
 *   });
 *
 */
Spark.prototype.roomGet = function(id) {
  return this.request('get', 'rooms', id, { showSipAddress: true })
    .then(res => this.toObject(res));
};

/**
 *
 * Add new Spark Room.
 *
 * @function
 *
 * @param {String} title
 * Title for new Room.
 *
 * @returns {Promise.<Room>}
 * Promise fulfilled with Room object.
 *
 * @example
 *
 * spark.roomsAdd('myroom')
 *   .then(function(room) {
 *     console.log(room.title);
 *   })
 *   .catch(function(err) {
 *     // process error
 *     console.log(err);
 *   });
 *
 */
Spark.prototype.roomAdd = function(title) {
  return this.request('post', 'rooms', { title: title })
    .then(res => this.toObject(res));
};

/**
 *
 * Rename Spark Room.
 *
 * @function
 *
 * @param {String} roomId
 * Spark Room ID
 *
 * @param {String} title
 * Title for new Room.
 *
 * @returns {Promise.<Room>}
 * Promise fulfilled with Room object.
 *
 * @example
 *
 * spark.roomsRename('Tm90aGluZyB0byBzZWUgaGVyZS4uLiBNb3ZlIGFsb25nLi4u', 'myroom2')
 *   .then(function(room) {
 *     console.log(room.title);
 *   })
 *   .catch(function(err) {
 *     // process error
 *     console.log(err);
 *   });
 *
 */
Spark.prototype.roomRename = function(id, title) {
  return this.request('put', 'rooms', id, { title: title })
    .then(res => this.toObject(res));
};

/**
 *
 * Remove Spark Room by ID.
 *
 * @function
 *
 * @param {String} roomId
 * Spark Room ID.
 *
 * @returns {Promise}
 * Promise fulfilled on delete.
 *
 * @example
 *
 * spark.roomsRemove('Tm90aGluZyB0byBzZWUgaGVyZS4uLiBNb3ZlIGFsb25nLi4u')
 *   .then(function() {
 *     console.log('Room removed.');
 *   })
 *   .catch(function(err) {
 *     // process error
 *     console.log(err);
 *   });
 *
 */
Spark.prototype.roomRemove = function(id) {
  return this.request('delete', 'rooms', id)
    .then(res => when(true));
};

/**
 *
 * Search Spark for People by display name.
 *
 * @function
 *
 * @param {String} displayName
 * Search String to find as display name.
 *
 * @param {Integer} max
 * (optional, defaults to all items) Number of records to return.
 *
 * @returns {Promise<Array>}
 * Promise fulfilled with array of Message objects.
 *
 * @example
 *
 * spark.peopleSearch('John', 10)
 *   .then(function(people) {
 *     // process people as array
 *     people.forEach(function(person) {
 *       console.log(person.displayName);
 *     });
 *   })
 *   .catch(function(err) {
 *     // process error
 *     console.log(err);
 *   });
 *
 */
Spark.prototype.peopleSearch = function(displayName, maxResults) {
  return this.request('get', 'people', {
      displayName: displayName,
      max: this.maxPageItems
    }, maxResults)
    .then(res => this.toArray(res));
};

/**
 *
 * Return details of Spark User by ID.
 *
 * @function
 *
 * @param {String} personId
 * Spark Person ID.
 *
 * @returns {Promise.<Person>}
 * Promise fulfilled with Person object.
 *
 * @example
 *
 * spark.personGet('Tm90aGluZyB0byBzZWUgaGVyZS4uLiBNb3ZlIGFsb25nLi4u')
 *   .then(function(person) {
 *     console.log(person.displayName);
 *   })
 *   .catch(function(err) {
 *     // process error
 *     console.log(err);
 *   });
 *
 */
Spark.prototype.personGet = function(id) {
  return this.request('get', 'people', id)
    .then(res => this.toObject(res));
};

/**
 *
 * Return details of Spark User that has authenticated.
 *
 * @function
 *
 * @returns {Promise.<Person>}
 * Promise fulfilled with Person object.
 *
 * @example
 *
 * spark.personMe()
 *   .then(function(person) {
 *     console.log(person.displayName);
 *   })
 *   .catch(function(err) {
 *     // process error
 *     console.log(err);
 *   });
 *
 */
Spark.prototype.personMe = function() {
  return this.request('get', 'people', 'me')
    .then(res => this.toObject(res));
};

/**
 *
 * Return details of Spark User by Email.
 *
 * @function
 *
 * @param {String} email
 * Email address of Spark User.
 *
 * @returns {Promise.<Person>}
 * Promise fulfilled with Person object.
 *
 * @example
 *
 * spark.personByEmail('aperson@company.com')
 *   .then(function(person) {
 *     console.log(person.displayName);
 *   })
 *   .catch(function(err) {
 *     // process error
 *     console.log(err);
 *   });
 *
 */
Spark.prototype.personByEmail = function(email) {
  if(typeof email === 'string' && validator.isEmail(email)) {
    return this.request('get', 'people', { email: email })
      .then(res => this.toObject(res));
  }

  else {
    return when.reject(new Error('not a valid email'));
  }
};

/**
 *
 * Return messages in a Spark Room.
 *
 * @function
 *
 * @param {String} roomId
 * Spark Room ID.
 *
 * @param {Integer} max
 * (optional, defaults to all items) Number of records to return.
 *
 * @returns {Promise.<Array>}
 * Promise fulfilled with array of Message objects.
 *
 * @example
 *
 * spark.messagesGet('Tm90aGluZyB0byBzZWUgaGVyZS4uLiBNb3ZlIGFsb25nLi4u', 100)
 *   .then(function(messages) {
 *     // process messages as array
 *     messages.forEach(function(message) {
 *       console.log(message.text);
 *     });
 *   })
 *   .catch(function(err) {
 *     // process error
 *     console.log(err);
 *   });
 *
 */
Spark.prototype.messagesGet = function(roomId, maxResults) {
  return this.request('get', 'messages', {
      roomId: roomId,
      max: this.maxPageItems
    }, maxResults)
    .then(res => this.toArray(res));
};

/**
 *
 * Return details of Spark Message by ID.
 *
 * @function
 *
 * @param {String} Message ID
 * Spark Message ID.
 *
 * @returns {Promise.<Message>}
 * Promise fulfilled with Message object.
 *
 * @example
 *
 * spark.messageGet('Tm90aGluZyB0byBzZWUgaGVyZS4uLiBNb3ZlIGFsb25nLi4u', 100)
 *   .then(function(message) {
 *     console.log(message.text);
 *   })
 *   .catch(function(err) {
 *     // process error
 *     console.log(err);
 *   });
 *
 */
Spark.prototype.messageGet = function(id) {
  return this.request('get', 'messages', id)
    .then(res => this.toObject(res));
};

/**
 *
 * Sends 1:1 Spark message to a person.
 *
 * @function
 *
 * @param {String} email
 * Email address of Spark User
 *
 * @returns {Promise.<Message>}
 * Promise fulfilled with Message object.
 *
 * @example
 *
 * spark.messageSendPerson('aperson@company.com', {
 *     text: 'Hello!',
 *     files: ['http://company.com/myfile.doc']
 *   })
 *   .then(function(message {
 *     console.log('Message sent: %s', message.txt) ;
 *   })
 *   .catch(function(err){
 *     console.log(err);
 *   });
 *
 */
Spark.prototype.messageSendPerson = function(email, message) {
  if(typeof email === 'string' && validator.isEmail(email)) {
    message.toPersonEmail = email;
    return this.request('post', 'messages', message)
      .then(res => this.toObject(res));
  }

  else {
    return when.reject(new Error('not a valid email'));
  }
};

/**
 *
 * Sends Spark message to a room.
 *
 * @function
 *
 * @param {String} roomId
 * Spark Room ID.
 *
 * @returns {Promise.<Message>}
 * Promise fulfilled with Message object.
 *
 * @example
 *
 * spark.messageSendRoom('Tm90aGluZyB0byBzZWUgaGVyZS4uLiBNb3ZlIGFsb25nLi4u', {
 *     text: 'Hello!',
 *     files: ['http://company.com/myfile.doc']
 *   })
 *   .then(function(message {
 *     console.log('Message sent: %s', message.txt);
 *   })
 *   .catch(function(err){
 *     console.log(err);
 *   });
 *
 */
Spark.prototype.messageSendRoom = function(roomId, message) {
  message.roomId = roomId;
  return this.request('post', 'messages', message)
    .then(res => this.toObject(res));
};

/**
 *
 * Remove Spark Message by ID.
 *
 * @function
 *
 * @param {String} messageId
 * Spark Message ID.
 *
 * @returns {Promise}
 * Promise fulfilled on delete.
 *
 * @example
 *
 * spark.messageRemove('Tm90aGluZyB0byBzZWUgaGVyZS4uLiBNb3ZlIGFsb25nLi4u')
 *   .then(function() {
 *     console.log('Message removed.');
 *   })
 *   .catch(function(err){
 *     console.log(err);
 *   });
 *
 */
Spark.prototype.messageRemove = function(id) {
  return this.request('delete', 'messages', id)
    .then(res => when(true));
};

/**
 *
 * Return details of Spark File by Content ID.
 *
 * @function
 *
 * @param {String} id
 * Spark Content ID.
 *
 * @returns {Promise.<File>}
 * Promise fulfilled with File object.
 *
 * @example
 *
 * spark.contentGet('Tm90aGluZyB0byBzZWUgaGVyZS4uLiBNb3ZlIGFsb25nLi4u')
 *   .then(function(file) {
 *     console.log('File name: %s', file.name);
 *   })
 *   .catch(function(err){
 *     console.log(err);
 *   });
 *
 */
Spark.prototype.contentGet = function(id) {
  return this.request('get', 'contents', id)
    .then(res => {
      if(res && res.headers && res.headers['content-disposition']) {
        // get file
        var file = {};
        file.id = id;
        file.name = res.headers['content-disposition'].match(/"(.*)"/)[1];
        file.ext = file.name.split('.').pop();
        file.type = res.headers['content-type'];
        file.binary = new Buffer(res.body, 'binary');
        file.base64 = new Buffer(res.body, 'binary').toString('base64');
        return when(file);
      } else {
        return when.reject(new Error('could not retrieve file headers'));
      }
    });
};

/**
 *
 * Return details of Spark File by Spark Content URL.
 *
 * @function
 *
 * @param {String} url
 * Spark Content URL.
 *
 * @returns {Promise.<File>}
 * Promise fulfilled with File object.
 *
 * @example
 *
 * spark.contentGetByUrl('http://api.ciscospark.com/v1/contents/Tm90aGluZyB0byBzZWUgaGVyZS4uLiBNb3ZlIGFsb25nLi4u')
 *   .then(function(file) {
 *     console.log('File name: %s', file.name);
 *   })
 *   .catch(function(err){
 *     console.log(err);
 *   });
 *
 */
Spark.prototype.contentByUrl = function(url) {
  var id = url.match(/contents\/(.*)/)[1];
    return this.contentGet(id);
};

/**
 *
 * Return all Spark Memberships registered to account.
 *
 * @function
 *
 * @param {Integer} max
 * (optional, defaults to all items) Number of records to return.
 *
 * @returns {Promise.<Array>}
 * Promise fulfilled with array of Membership objects.
 *
 * @example
 *
 * spark.membershipsGet(100)
 *   .then(function(messages) {
 *     // process memberships as array
 *     memberships.forEach(function(membership) {
 *       console.log(membership.personEmail);
 *     });
 *   })
 *   .catch(function(err) {
 *     // process error
 *     console.log(err);
 *   });
 *
 */
Spark.prototype.membershipsGet = function(maxResults) {
  return this.request('get', 'memberships', { max: this.maxPageItems }, maxResults)
    .then(res => this.toArray(res));
};

/**
 *
 * Return all Spark Memberships in a Spark Room.
 *
 * @function
 *
 * @param {String} roomId
 * Spark Room ID.
 *
 * @param {Integer} max
 * (optional, defaults to all items) Number of records to return.
 *
 * @returns {Promise.<Array>}
 * Promise fulfilled with array of Membership objects.
 *
 * @example
 *
 * spark.membershipsByRoom('Tm90aGluZyB0byBzZWUgaGVyZS4uLiBNb3ZlIGFsb25nLi4u', 100)
 *   .then(function(messages) {
 *     // process memberships as array
 *     memberships.forEach(function(membership) {
 *       console.log(membership.personEmail);
 *     });
 *   })
 *   .catch(function(err) {
 *     // process error
 *     console.log(err);
 *   });
 *
 */
Spark.prototype.membershipsByRoom = function(roomId, maxResults) {
  return this.request('get', 'memberships', {
      roomId: roomId,
      max: this.maxPageItems
    }, maxResults)
    .then(res => this.toArray(res));
};

/**
 *
 * Return Spark Membership by ID.
 *
 * @function
 *
 * @param {String} membershipId
 * Spark Membership ID.
 *
 * @returns {Promise.<Membership>}
 * Promise fulfilled Membership object.
 *
 * @example
 *
 * spark.membershipGet('Tm90aGluZyB0byBzZWUgaGVyZS4uLiBNb3ZlIGFsb25nLi4u')
 *   .then(function(membership) {
 *     console.log(membership.personEmail);
 *   })
 *   .catch(function(err){
 *     console.log(err);
 *   });
 *
 */
Spark.prototype.membershipGet = function(id) {
  return this.request('get', 'memberships', id)
    .then(res => this.toObject(res));
};

/**
 *
 * Return Spark Membership by Room and Email.
 *
 * @function
 *
 * @param {String} roomId
 * Spark Membership ID.
 *
 * @param {String} personEmail
 * Email of Person.
 *
 * @returns {Promise.<Membership>}
 * Promise fulfilled with Membership object.
 *
 * @example
 *
 * spark.membershipGet('Tm90aGluZyB0byBzZWUgaGVyZS4uLiBNb3ZlIGFsb25nLi4u', 'aperson@company.com')
 *   .then(function(membership) {
 *     console.log('%s is a moderator: %s', membership.personEmail, membership.isModerator);
 *   })
 *   .catch(function(err){
 *     console.log(err);
 *   });
 *
 */
Spark.prototype.membershipByRoomByEmail = function(roomId, personEmail) {
  return this.request('get', 'memberships', {
      roomId: roomId,
      personEmail: personEmail
    })
   .then(res => this.toObject(res));
};

/**
 *
 * Add new Spark Membership.
 *
 * @function
 *
 * @param {String} roomId
 * Spark Room ID.
 *
 * @param {String} email
 * Email address of person to add.
 *
 * @param {Boolean} moderator
 * Boolean value to add as moderator.
 *
 * @returns {Promise.<Membership>}
 * Promise fulfilled with Membership object.
 *
 * @example
 *
 * spark.membershipGet('Tm90aGluZyB0byBzZWUgaGVyZS4uLiBNb3ZlIGFsb25nLi4u', 'aperson@company.com')
 *   .then(function(membership) {
 *     console.log('%s is a moderator: %s', membership.personEmail, membership.isModerator);
 *   })
 *   .catch(function(err){
 *     console.log(err);
 *   });
 *
 */
Spark.prototype.membershipAdd = function(roomId, email, moderator) {
  if(typeof email === 'string' && validator.isEmail(email)) {
    return this.request('post', 'memberships', {
      personEmail: email,
      roomId: roomId,
      isModerator: (typeof moderator === 'boolean' && moderator)
    })
    .then(res => this.toObject(res));
  }

  else {
    return when.reject(new Error('not a valid email'));
  }
};

/**
 *
 * Set a membership as moderator.
 *
 * @function
 *
 * @param {String} membershipId
 * Spark Membership ID.
 *
 * @returns {Promise.<Membership>}
 * Promise fulfilled with Membership object.
 *
 * @example
 *
 * spark.membershipSetModerator('Tm90aGluZyB0byBzZWUgaGVyZS4uLiBNb3ZlIGFsb25nLi4u')
 *   .then(function(membership) {
 *     console.log('%s is a moderator: %s', membership.personEmail, membership.isModerator);
 *   })
 *   .catch(function(err){
 *     console.log(err);
 *   });
 *
 */
Spark.prototype.membershipSetModerator = function(id) {
  return this.request('put', 'memberships', id, { isModerator: true })
    .then(res => this.toObject(res));
};

/**
 *
 * Remove a membership as moderator.
 *
 * @function
 *
 * @param {String} membershipId
 * Spark Membership ID.
 *
 * @returns {Promise.<Membership>}
 * Promise fulfilled with Membership object.
 *
 * @example
 *
 * spark.membershipClearModerator('Tm90aGluZyB0byBzZWUgaGVyZS4uLiBNb3ZlIGFsb25nLi4u')
 *   .then(function(membership) {
 *     console.log('%s is a moderator: %s', membership.personEmail, membership.isModerator);
 *   })
 *   .catch(function(err){
 *     console.log(err);
 *   });
 *
 */
Spark.prototype.membershipClearModerator = function(id) {
  return this.request('put', 'memberships', id, { isModerator: false })
    .then(res => this.toObject(res));
};

/**
 *
 * Remove Spark Membership by ID.
 *
 * @function
 *
 * @param {String} membershipId
 * Spark Membership ID.
 *
 * @returns {Promise}
 * Promise fulfilled on delete.
 *
 * @example
 *
 * spark.membershipRemove('Tm90aGluZyB0byBzZWUgaGVyZS4uLiBNb3ZlIGFsb25nLi4u')
 *   .then(function() {
 *     console.log('Membership removed');
 *   })
 *   .catch(function(err){
 *     console.log(err);
 *   });
 *
 */
Spark.prototype.membershipRemove = function(id) {
  return this.request('delete', 'memberships', id)
    .then(res => when(true));
};

/**
 *
 * Return all Spark Webhooks registered to account.
 *
 * @function
 *
 * @param {Integer} max
 * (optional, defaults to all items) Number of records to return.
 *
 * @returns {Promise.<Array>}
 * Promise fulfills with array of Webhook objects.
 *
 * @example
 *
 * spark.webhooksGet(100)
 *   .then(function(webhooks) {
 *     // process webhooks as array
 *     webhooks.forEach(function(webhook) {
 *       console.log(webhook.name);
 *     });
 *   })
 *   .catch(function(err) {
 *     // process error
 *     console.log(err);
 *   });
 *
 */
Spark.prototype.webhooksGet = function(maxResults) {
  return this.request('get', 'webhooks', { max: this.maxPageItems }, maxResults)
    .then(res => this.toArray(res));
};

/**
 *
 * Return details of Spark Webhook by ID.
 *
 * @function
 *
 * @param {String} webhookId
 * Spark Webhook ID.
 *
 * @returns {Promise.<Webhook>}
 * Promise fulfills with Webhook object.
 *
 * @example
 *
 * spark.webhookGet('Tm90aGluZyB0byBzZWUgaGVyZS4uLiBNb3ZlIGFsb25nLi4u')
 *   .then(function(webhook) {
 *     console.log(webhook.name);
 *   })
 *   .catch(function(err) {
 *     // process error
 *     console.log(err);
 *   });
 *
 */
Spark.prototype.webhookGet = function(id) {
  return this.request('get', 'webhooks', id)
    .then(res => this.toObject(res));
};

/**
 *
 * Add new Spark Webhook.
 *
 * @function
 *
 * @param {String} resource
 * Resource for webhook.
 *
 * @param {String} event
 * Event for webhook.
 *
 * @param {String} name
 * (optional, defaults to 'mywebhook') Name assigned to webhook to add.
 *
 * @param {String} roomId
 * (required only if resource !== 'all') Spark Room ID.
 *
 * @returns {Promise.<Webhook>}
 * Promise fulfilled with Webhook object.
 *
 * @example
 *
 * spark.webhookAdd('messages', 'created', 'mywebhook', 'Tm90aGluZyB0byBzZWUgaGVyZS4uLiBNb3ZlIGFsb25nLi4u')
 *   .then(function(webhook) {
 *     console.log(webhook.name);
 *   })
 *   .catch(function(err) {
 *     // process error
 *     console.log(err);
 *   });
 *
 */
Spark.prototype.webhookAdd = function(resource, event, name, roomId) {
  var config = {};

  // verify webhook url is defined
  if(!this.webhookUrl) {
    return when.reject(new Error('webhook url not specified'));
  }

  // validate resource types
  if(typeof resource !== 'string' || typeof event !== 'string' || typeof name !== 'string') {
    return when.reject(new Error('invalid parameter types passed'));
  }

  // validate updated event is not passed for messages resource
  if(resource === 'messages' && event === 'updated') {
    return when.reject(new Error('invalid event value passed'));
  }

  // validate delted event is not passed for rooms resource
  if(resource === 'rooms' && event === 'deleted') {
    return when.reject(new Error('invalid event value passed'));
  }

  // validate resource values
  if(_.includes(['all', 'rooms', 'memberships', 'messages'], resource)) {
    config.resource = resource;
    config.targetUrl = this.webhookUrl;
    config.name = name || roomId || 'mywebhook';
  } else {
    return when.reject(new Error('invalid resource value passed'));
  }

  // validate event values
  if(_.includes(['all', 'created', 'updated', 'deleted'], event)) {
    config.event = event;
  } else {
    return when.reject(new Error('invalid event value passed'));
  }

  // add roomid for non "all" events
  if(event !== 'all' && typeof roomId === 'string') {
    config.filter = 'roomId=' + roomId;
  }

  // setup webhook
  return this.request('post', 'webhooks', config)
    .then(res => this.toObject(res));
};

/**
 *
 * Remove Spark Webhook by ID.
 *
 * @function
 *
 * @param {String} webhookId
 * Spark Webhook ID.
 *
 * @returns {Promise}
 * Promise fulfilled on delete.
 *
 * @example
 *
 * spark.webhookRemove('Tm90aGluZyB0byBzZWUgaGVyZS4uLiBNb3ZlIGFsb25nLi4u')
 *   .then(function() {
 *     console.log('Webhook removed');
 *   })
 *   .catch(function(err){
 *     console.log(err);
 *   });
 *
 */
Spark.prototype.webhookRemove = function(id) {
  return this.request('delete', 'webhooks', id)
    .then(res => when(true));
};

module.exports = Spark;
