/**
 * @file Defines SPARK Class
 * @author Nicholas Marus <nmarus@gmail.com>
 * @license LGPL-3.0
 */

'use strict';

var EventEmitter = require('events').EventEmitter;
var Bottleneck = require('bottleneck');
var debug = require('debug')('spark');
var util = require('util');
var when = require('when');
var req = require('request');
var _ = require('lodash');

var validator = require('./validator');
var u = require('./utils');

/**
 * Creates a Spark API instance that is then attached to a Spark Account.
 *
 * @constructor
 * @param {Object} options - Configuration object containing Spark settings
 * @throw {Error} Throws on spark token missing in options object.
 */
function Spark(options) {
  EventEmitter.call(this);

  this.id = u.genUUID64();

  /**
   * Options Object
   * @memberof Spark
   * @namespace options
   * @instance
   * @property {string} token - Spark Token.
   * @property {string} webhookUrl - URL that is used for SPark API to send callbacks.
   * @property {number} [maxPageItems=50] - Max results that the paginator uses.
   * @property {number} [maxConcurrent=3] - Max concurrent sessions to the Spark API
   * @property {number} [minTime=600] - Min time between consecutive request starts.
   * @property {number} [requeueMinTime=minTime*10] - Min time between consecutive request starts of requests that have been re-queued.
   * @property {number} [requeueMaxRetry=3] - Msx number of atteempts to make for failed request.
   * @property {array} [requeueCodes=[429,500,503]] - Array of http result codes that should be retried.
   * @property {number} [requestTimeout=20000] - Timeout for an individual request recieving a response.
   * @property {number} [queueSize=10000] - Size of the buffer that holds outbound requests.
   * @property {number} [requeueSize=10000] - Size of the buffer that holds outbound re-queue requests.
   */
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

    /**
     * Spark Queue Drop Event.
     *
     * @event drop
     * @type {object}
     * @property {options} request - API Request
     * @property {string} id - Spark UUID
     */
    this.emit('dropped', dropped, this.id);
  });

  // queue for API calls that fail
  this.requeue = new Bottleneck(this.maxConcurrent, this.requeueMinTime, this.requeueSize);
  this.requeue.on('dropped', dropped => {
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
 * Format Spark API Call, make http request, and validate response.
 *
 * @private
 * @param {String} method
 * @param {String} resource
 * @param {id} id
 * @param {query} query
 * @returns {Promise.<Response>}
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

    /**
     * Spark request event.
     *
     * @event request
     * @type {object}
     * @property {options} request - API Request
     * @property {string} id - Spark UUID
     */
    this.emit('request', options, this.id);

    return when(this.queue.schedule(request, options))
      .then(response => {

        /**
         * Spark response event.
         *
         * @event reponse
         * @type {object}
         * @property {options} response - Response
         * @property {string} id - Spark UUID
         */
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

    /**
     * Spark retry event.
     *
     * @event retry
     * @type {object}
     * @property {options} request - API Request
     * @property {string} id - Spark UUID
     */
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
        }

        // return response
        else {
          return when(response);
        }
      });
  };

  // recursive pagination
  var requestPaginate = (items, link) => {

    // limit max results
    if(typeof maxResults === 'number' && items.length > maxResults) {
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
              if(typeof maxResults === 'number' && allItems.length > 0) {
                allItems = allItems.slice(0, maxResults);
              }
              response.body.items = allItems;
              return when(response);
            });
        }

        // return response
        else {
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
 * Parse Spark API response to object.
 *
 * @private
 * @param {Response} response - Spark API response
 * @returns {Promise.<Object>}
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
 * Parse Spark API response to array.
 *
 * @private
 * @param {Response} response - Spark API response
 * @returns {Array}
 */
Spark.prototype.toArray = function(response, max) {
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
 * Return all Spark Rooms registered to account.
 *
 * @function
 * @param {Integer} [max] - Number of records to return
 * @returns {Promise.<Array>}
 *
 * @example
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
 */
Spark.prototype.roomsGet = function(maxResults) {
  return this.request('get', 'rooms', { max: this.maxPageItems }, maxResults)
    .then(res => this.toArray(res));
};

/**
 * Return all Spark 1:1 Rooms.
 *
 * @function
 * @param {Integer} [max] - Number of records to return
 * @returns {Promise.<Array>}
 *
 * @example
 * spark.roomsDirect(10)
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
 */
Spark.prototype.roomsDirect = function(maxResults) {
  return this.request('get', 'rooms', { type: 'direct', max: this.maxPageItems }, maxResults)
    .then(res => this.toArray(res));
};

/**
 * Return all Spark Group Rooms.
 *
 * @function
 * @param {Integer} [max] - Number of records to return
 * @returns {Promise.<Array>}
 *
 * @example
 * spark.roomsGroup(10)
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
 */
Spark.prototype.roomsGroup = function(maxResults) {
  return this.request('get', 'rooms', { type: 'group', max: this.maxPageItems }, maxResults)
    .then(res => this.toArray(res));
};

/**
 * Return all Spark Rooms for a particular Team ID.
 *
 * @function
 * @param {String} teamId - The Spark Team ID
 * @param {Integer} [max] - Number of records to return
 * @returns {Promise.<Array>}
 *
 * @example
 * spark.roomsByTeam('Tm90aGluZyB0byBzZWUgaGVyZS4uLiBNb3ZlIGFsb25nLi4u', 10)
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
 */
Spark.prototype.roomsByTeam = function(teamId, maxResults) {
  return this.request('get', 'rooms', { teamId: teamId, max: this.maxPageItems }, maxResults)
    .then(res => this.toArray(res));
};

/**
 * Return details of Spark Room by ID.
 *
 * @function
 * @param {String} roomId - Spark Room ID
 * @returns {Promise.<Room>}
 *
 * @example
 * spark.roomGet('Tm90aGluZyB0byBzZWUgaGVyZS4uLiBNb3ZlIGFsb25nLi4u')
 *   .then(function(room) {
 *     console.log(room.title);
 *   })
 *   .catch(function(err) {
 *     // process error
 *     console.log(err);
 *   });
 */
Spark.prototype.roomGet = function(roomId) {

  /**
   * Room Object
   *
   * @namespace Room
   * @property {string} id - Room ID
   * @property {string} title - Room Title
   * @property {string} type - Room Type
   * @property {boolean} isLocked - Room Moderated/Locked
   * @property {string} teamId - Team ID
   * @property {date} lastActivity - Last Activity in Room
   * @property {date} created - Room Created
   */
  return this.request('get', 'rooms', roomId, { showSipAddress: true })
    .then(res => this.toObject(res));
};

/**
 * Add new Spark Room.
 *
 * @function
 * @param {String} title - Title for new Room
 * @returns {Promise.<Room>}
 *
 * @example
 * spark.roomAdd('myroom')
 *   .then(function(room) {
 *     console.log(room.title);
 *   })
 *   .catch(function(err) {
 *     // process error
 *     console.log(err);
 *   });
 */
Spark.prototype.roomAdd = function(title) {
  return this.request('post', 'rooms', { title: title })
    .then(res => this.toObject(res));
};

/**
 * Rename Spark Room.
 *
 * @function
 * @param {String} roomId - Spark Room ID
 * @param {String} title - Title for new Room
 * @returns {Promise.<Room>}
 *
 * @example
 * spark.roomRename('Tm90aGluZyB0byBzZWUgaGVyZS4uLiBNb3ZlIGFsb25nLi4u', 'myroom2')
 *   .then(function(room) {
 *     console.log(room.title);
 *   })
 *   .catch(function(err) {
 *     // process error
 *     console.log(err);
 *   });
 */
Spark.prototype.roomRename = function(roomId, title) {
  return this.request('put', 'rooms', roomId, { title: title })
    .then(res => this.toObject(res));
};

/**
 * Remove Spark Room by ID.
 *
 * @function
 * @param {String} roomId - Spark Room ID
 * @returns {Promise}
 *
 * @example
 * spark.roomRemove('Tm90aGluZyB0byBzZWUgaGVyZS4uLiBNb3ZlIGFsb25nLi4u')
 *   .then(function() {
 *     console.log('Room removed.');
 *   })
 *   .catch(function(err) {
 *     // process error
 *     console.log(err);
 *   });
 */
Spark.prototype.roomRemove = function(roomId) {
  return this.request('delete', 'rooms', roomId)
    .then(res => when(true));
};

/**
 * Search Spark for People by display name.
 *
 * @function
 * @param {String} displayName - Search String to find as display name
 * @param {Integer} [max] - Number of records to return
 * @returns {Promise<Array>}
 *
 * @example
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
 */
Spark.prototype.peopleSearch = function(displayName, maxResults) {
  return this.request('get', 'people', {
      displayName: displayName,
      max: this.maxPageItems
    }, maxResults)
    .then(res => this.toArray(res));
};

/**
 * Return details of Spark User by ID.
 *
 * @function
 * @param {String} personId - Spark Person ID
 * @returns {Promise.<Person>}
 *
 * @example
 * spark.personGet('Tm90aGluZyB0byBzZWUgaGVyZS4uLiBNb3ZlIGFsb25nLi4u')
 *   .then(function(person) {
 *     console.log(person.displayName);
 *   })
 *   .catch(function(err) {
 *     // process error
 *     console.log(err);
 *   });
 */
Spark.prototype.personGet = function(personId) {

  /**
   * Person Object
   *
   * @namespace Person
   * @property {string} id - Person ID
   * @property {array} emails - Emails
   * @property {string} displayName - Display Name
   * @property {string} avatar - Avatar URL
   * @property {date} created - Date created
   * @property {string} email - Email
   * @property {string} username - Username
   * @property {string} domain - Domain name
   */
  return this.request('get', 'people', personId)
    .then(res => this.toObject(res));
};

/**
 * Return details of Spark User that has authenticated.
 *
 * @function
 * @returns {Promise.<Person>}
 *
 * @example
 * spark.personMe()
 *   .then(function(person) {
 *     console.log(person.displayName);
 *   })
 *   .catch(function(err) {
 *     // process error
 *     console.log(err);
 *   });
 */
Spark.prototype.personMe = function() {
  return this.request('get', 'people', 'me')
    .then(res => this.toObject(res));
};

/**
 * Return details of Spark User by Email.
 *
 * @function
 * @param {String} email - Email address of Spark User
 * @returns {Promise.<Person>}
 *
 * @example
 * spark.personByEmail('aperson@company.com')
 *   .then(function(person) {
 *     console.log(person.displayName);
 *   })
 *   .catch(function(err) {
 *     // process error
 *     console.log(err);
 *   });
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
 * Return messages in a Spark Room.
 *
 * @function
 * @param {String} roomId - Spark Room ID
 * @param {Integer} [max] - Number of records to return
 * @returns {Promise.<Array>}
 *
 * @example
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
 */
Spark.prototype.messagesGet = function(roomId, maxResults) {
  return this.request('get', 'messages', {
      roomId: roomId,
      max: this.maxPageItems
    }, maxResults)
    .then(res => this.toArray(res));
};

/**
 * Return details of Spark Message by ID.
 *
 * @function
 * @param {String} messageId - Spark Message ID
 * @returns {Promise.<Message>}
 *
 * @example
 * spark.messageGet('Tm90aGluZyB0byBzZWUgaGVyZS4uLiBNb3ZlIGFsb25nLi4u', 100)
 *   .then(function(message) {
 *     console.log(message.text);
 *   })
 *   .catch(function(err) {
 *     // process error
 *     console.log(err);
 *   });
 */
Spark.prototype.messageGet = function(messageId) {

  /**
   * Message Object
   *
   * @namespace Message
   * @property {string} id - Message ID
   * @property {string} personId - Person ID
   * @property {string} personEmail - Person Email
   * @property {string} roomId - Room ID
   * @property {string} text - Message text
   * @property {array} files - Array of File objects
   * @property {date} created - Date Message created
   */
  return this.request('get', 'messages', messageId)
    .then(res => this.toObject(res));
};

/**
 * Sends 1:1 Spark message to a person.
 *
 * @function
 * @param {String} email - Email address of Spark User
 * @returns {Promise.<Message>}
 *
 * @example
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
 * Sends Spark message to a room.
 *
 * @function
 * @param {String} roomId - Spark Room ID
 * @returns {Promise.<Message>}
 *
 * @example
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
 */
Spark.prototype.messageSendRoom = function(roomId, message) {
  message.roomId = roomId;
  return this.request('post', 'messages', message)
    .then(res => this.toObject(res));
};

/**
 * Remove Spark Message by ID.
 *
 * @function
 * @param {String} messageId - Spark Message ID
 * @returns {Promise}
 *
 * @example
 * spark.messageRemove('Tm90aGluZyB0byBzZWUgaGVyZS4uLiBNb3ZlIGFsb25nLi4u')
 *   .then(function() {
 *     console.log('Message removed.');
 *   })
 *   .catch(function(err){
 *     console.log(err);
 *   });
 */
Spark.prototype.messageRemove = function(messageId) {
  return this.request('delete', 'messages', messageId)
    .then(res => when(true));
};

/**
 * Return details of Spark File by Content ID.
 *
 * @function
 * @param {String} id - Spark Content ID
 * @returns {Promise.<File>}
 *
 * @example
 * spark.contentGet('Tm90aGluZyB0byBzZWUgaGVyZS4uLiBNb3ZlIGFsb25nLi4u')
 *   .then(function(file) {
 *     console.log('File name: %s', file.name);
 *   })
 *   .catch(function(err){
 *     console.log(err);
 *   });
 */
Spark.prototype.contentGet = function(contentId) {
  return this.request('get', 'contents', contentId)
    .then(res => {
      if(res && res.headers && res.headers['content-disposition']) {

        /**
         * File Object
         *
         * @namespace File
         * @property {string} id - Spark API Content ID
         * @property {string} name - File name
         * @property {string} ext - File extension
         * @property {string} type - Header [content-type] for file
         * @property {buffer} binary - File contents as binary
         * @property {string} base64 - File contents as base64 encoded string
         */
        var file = {};
        file.id = contentId;
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
 * Return details of Spark File by Spark Content URL.
 *
 * @function
 * @param {String} url - Spark Content URL
 * @returns {Promise.<File>}
 *
 * @example
 * spark.contentByUrl('http://api.ciscospark.com/v1/contents/Tm90aGluZyB0byBzZWUgaGVyZS4uLiBNb3ZlIGFsb25nLi4u')
 *   .then(function(file) {
 *     console.log('File name: %s', file.name);
 *   })
 *   .catch(function(err){
 *     console.log(err);
 *   });
 */
Spark.prototype.contentByUrl = function(url) {
  var contentId = url.match(/contents\/(.*)/)[1];
    return this.contentGet(contentId);
};

/**
 * Return all Spark Teams registered to account.
 *
 * @function
 * @param {Integer} [max] - Number of records to return
 * @returns {Promise.<Array>}
 *
 * @example
 * spark.teamsGet(10)
 *   .then(function(teams) {
 *     // process teams as array
 *     teams.forEach(function(team) {
 *       console.log(team.name);
 *     });
 *   })
 *   .catch(function(err) {
 *     // process error
 *     console.log(err);
 *   });
 */
Spark.prototype.teamsGet = function(maxResults) {
  return this.request('get', 'teams', { max: this.maxPageItems }, maxResults)
    .then(res => this.toArray(res));
};

/**
 * Return details of Spark Team by ID.
 *
 * @function
 * @param {String} teamId - Spark Team ID
 * @returns {Promise.<Team>}
 *
 * @example
 * spark.teamGet('Tm90aGluZyB0byBzZWUgaGVyZS4uLiBNb3ZlIGFsb25nLi4u')
 *   .then(function(team) {
 *     console.log(team.name);
 *   })
 *   .catch(function(err) {
 *     // process error
 *     console.log(err);
 *   });
 */
Spark.prototype.teamGet = function(teamId) {

  /**
   * Team Object
   *
   * @namespace Team
   * @property {string} id - Message ID
   * @property {string} name - Team name
   * @property {date} created - Date Team created
   */
  return this.request('get', 'teams', teamId)
    .then(res => this.toObject(res));
};

/**
 * Add new Spark Team.
 *
 * @function
 * @param {String} name - Name for new Team
 * @returns {Promise.<Team>}
 *
 * @example
 * spark.teamAdd('myteam')
 *   .then(function(team) {
 *     console.log(team.name);
 *   })
 *   .catch(function(err) {
 *     // process error
 *     console.log(err);
 *   });
 */
Spark.prototype.teamAdd = function(name) {
  return this.request('post', 'teams', { name: name })
    .then(res => this.toObject(res));
};

/**
 * Add new Spark Team Room.
 *
 * @function
 * @param {String} teamId - Spark Team ID
 * @param {String} title - Title for new Room
 * @returns {Promise.<Room>}
 *
 * @example
 * spark.teamRoomAdd('Tm90aGluZyB0byBzZWUgaGVyZS4uLiBNb3ZlIGFsb25nLi4u', 'myroom')
 *   .then(function(room) {
 *     console.log(room.title);
 *   })
 *   .catch(function(err) {
 *     // process error
 *     console.log(err);
 *   });
 */
Spark.prototype.teamRoomAdd = function(teamId, title) {
  return this.request('post', 'rooms', {
    teamId: teamId,
    title: title
  })
  .then(res => this.toObject(res));
};

/**
 * Rename a Spark Team.
 *
 * @function
 * @param {String} teamId - Spark Team ID
 * @param {String} name - Name for new Team
 * @returns {Promise.<Team>}
 *
 * @example
 * spark.teamRename('Tm90aGluZyB0byBzZWUgaGVyZS4uLiBNb3ZlIGFsb25nLi4u', 'myteam2')
 *   .then(function(team) {
 *     console.log(team.name);
 *   })
 *   .catch(function(err) {
 *     // process error
 *     console.log(err);
 *   });
 */
Spark.prototype.teamRename = function(teamId, name) {
  return this.request('put', 'teams', teamId, { name: name })
    .then(res => this.toObject(res));
};

/**
 * Remove Spark Team by ID.
 *
 * @function
 * @param {String} teamId - Spark Team ID
 * @returns {Promise}
 *
 * @example
 * spark.teamRemove('Tm90aGluZyB0byBzZWUgaGVyZS4uLiBNb3ZlIGFsb25nLi4u')
 *   .then(function() {
 *     console.log('Team removed.');
 *   })
 *   .catch(function(err) {
 *     // process error
 *     console.log(err);
 *   });
 */
Spark.prototype.teamRemove = function(teamId) {
  return this.request('delete', 'teams', teamId)
    .then(res => when(true));
};

/**
 * Return all Spark Team Memberships for a specific Team.
 *
 * @function
 * @param {String} teamId - Spark Team ID
 * @param {Integer} [max] - Number of records to return
 * @returns {Promise.<Array>}
 *
 * @example
 * spark.teamMembershipsGet('Tm90aGluZyB0byBzZWUgaGVyZS4uLiBNb3ZlIGFsb25nLi4u', 100)
 *   .then(function(memberships) {
 *     // process memberships as array
 *     memberships.forEach(function(membership) {
 *       console.log(membership.personEmail);
 *     });
 *   })
 *   .catch(function(err) {
 *     // process error
 *     console.log(err);
 *   });
 */
Spark.prototype.teamMembershipsGet = function(teamId, maxResults) {
  return this.request('get', 'team/memberships', {
    teamId: teamId,
    max: this.maxPageItems
  }, maxResults)
    .then(res => this.toArray(res));
};

/**
 * Return Spark Team Membership by ID.
 *
 * @function
 * @param {String} membershipId - Spark Membership ID
 * @returns {Promise.<TeamMembership>}
 *
 * @example
 * spark.membershipGet('Tm90aGluZyB0byBzZWUgaGVyZS4uLiBNb3ZlIGFsb25nLi4u')
 *   .then(function(membership) {
 *     console.log(membership.personEmail);
 *   })
 *   .catch(function(err){
 *     console.log(err);
 *   });
 */
Spark.prototype.teamMembershipGet = function(membershipId) {
  /**
   * Team Membership Object
   *
   * @namespace TeamMembership
   * @property {string} id - Membership ID
   * @property {string} teamId - Team ID
   * @property {string} personId - Person ID
   * @property {string} personEmail - Person Email
   * @property {boolean} isModerator - Membership is a moderator
   * @property {date} created - Date Membership created
   */
  return this.request('get', 'team/memberships', membershipId)
    .then(res => this.toObject(res));
};

/**
 * Add new Spark Team Membership.
 *
 * @function
 * @param {String} teamId - Spark Team ID
 * @param {String} email - Email address of person to add
 * @param {Boolean} moderator - Boolean value to add as moderator
 * @returns {Promise.<TeamMembership>}
 *
 * @example
 * spark.teamMembershipAdd('Tm90aGluZyB0byBzZWUgaGVyZS4uLiBNb3ZlIGFsb25nLi4u', 'aperson@company.com')
 *   .then(function(membership) {
 *     console.log(membership.id);
 *   })
 *   .catch(function(err){
 *     console.log(err);
 *   });
 */
Spark.prototype.teamMembershipAdd = function(teamId, email, moderator) {
  if(typeof email === 'string' && validator.isEmail(email)) {
    return this.request('post', 'team/memberships', {
      personEmail: email,
      teamId: teamId,
      isModerator: (typeof moderator === 'boolean' && moderator)
    })
    .then(res => this.toObject(res));
  }

  else {
    return when.reject(new Error('not a valid email'));
  }
};

/**
 * Set a Team Membership as moderator.
 *
 * @function
 * @param {String} membershipId - Spark Membership ID
 * @returns {Promise.<TeamMembership>}
 *
 * @example
 * spark.teamMembershipSetModerator('Tm90aGluZyB0byBzZWUgaGVyZS4uLiBNb3ZlIGFsb25nLi4u')
 *   .then(function(membership) {
 *     console.log('%s is a moderator: %s', membership.personEmail, membership.isModerator);
 *   })
 *   .catch(function(err){
 *     console.log(err);
 *   });
 */
Spark.prototype.teamMembershipSetModerator = function(membershipId) {
  return this.request('put', 'team/memberships', membershipId, { isModerator: true })
    .then(res => this.toObject(res));
};

/**
 * Remove a Team Membership as moderator.
 *
 * @function
 * @param {String} membershipId - Spark Membership ID
 * @returns {Promise.<TeamMembership>}
 *
 * @example
 * spark.teamMembershipClearModerator('Tm90aGluZyB0byBzZWUgaGVyZS4uLiBNb3ZlIGFsb25nLi4u')
 *   .then(function(membership) {
 *     console.log('%s is a moderator: %s', membership.personEmail, membership.isModerator);
 *   })
 *   .catch(function(err){
 *     console.log(err);
 *   });
 */
Spark.prototype.teamMembershipClearModerator = function(membershipId) {
  return this.request('put', 'team/memberships', membershipId, { isModerator: false })
    .then(res => this.toObject(res));
};

/**
 * Remove Spark Team Membership by ID..
 *
 *
 * @function
 * @param {String} membershipId - Spark Membership ID
 * @returns {Promise}
 *
 * @example
 * spark.teamMembershipRemove('Tm90aGluZyB0byBzZWUgaGVyZS4uLiBNb3ZlIGFsb25nLi4u')
 *   .then(function() {
 *     console.log('Membership removed');
 *   })
 *   .catch(function(err){
 *     console.log(err);
 *   });
 */
Spark.prototype.teamMembershipRemove = function(membershipId) {
  return this.request('delete', 'team/memberships', membershipId)
    .then(res => when(true));
};

/**
 * Return all Spark Memberships registered to account..
 *
 *
 * @function
 * @param {Integer} [max] - Number of records to return
 * @returns {Promise.<Array>}
 *
 * @example
 * spark.membershipsGet(100)
 *   .then(function(memberships) {
 *     // process memberships as array
 *     memberships.forEach(function(membership) {
 *       console.log(membership.personEmail);
 *     });
 *   })
 *   .catch(function(err) {
 *     // process error
 *     console.log(err);
 *   });
 */
Spark.prototype.membershipsGet = function(maxResults) {
  return this.request('get', 'memberships', { max: this.maxPageItems }, maxResults)
    .then(res => this.toArray(res));
};

/**
 * Return all Spark Memberships in a Spark Room..
 *
 *
 * @function
 * @param {String} roomId - Spark Room ID
 * @param {Integer} [max] - Number of records to return
 * @returns {Promise.<Array>}
 *
 * @example
 * spark.membershipsByRoom('Tm90aGluZyB0byBzZWUgaGVyZS4uLiBNb3ZlIGFsb25nLi4u', 100)
 *   .then(function(memberships) {
 *     // process memberships as array
 *     memberships.forEach(function(membership) {
 *       console.log(membership.personEmail);
 *     });
 *   })
 *   .catch(function(err) {
 *     // process error
 *     console.log(err);
 *   });
 */
Spark.prototype.membershipsByRoom = function(roomId, maxResults) {
  return this.request('get', 'memberships', {
      roomId: roomId,
      max: this.maxPageItems
    }, maxResults)
    .then(res => this.toArray(res));
};

/**
 * Return Spark Membership by ID..
 *
 *
 * @function
 * @param {String} membershipId - Spark Membership ID
 * @returns {Promise.<Membership>}
 *
 * @example
 * spark.membershipGet('Tm90aGluZyB0byBzZWUgaGVyZS4uLiBNb3ZlIGFsb25nLi4u')
 *   .then(function(membership) {
 *     console.log(membership.personEmail);
 *   })
 *   .catch(function(err){
 *     console.log(err);
 *   });
 */
Spark.prototype.membershipGet = function(membershipId) {
  /**
   * Membership Object
   *
   * @namespace Membership
   * @property {string} id - Membership ID
   * @property {string} personId - Person ID
   * @property {string} personEmail - Person Email
   * @property {boolean} isModerator - Membership is a moderator
   * @property {boolean} isMonitor - Membership is a monitor
   * @property {date} created - Date Membership created
   */
  return this.request('get', 'memberships', membershipId)
    .then(res => this.toObject(res));
};

/**
 * Return Spark Membership by Room and Email..
 *
 * @function
 * @param {String} roomId - Spark Membership ID
 * @param {String} personEmail - Email of Person
 * @returns {Promise.<Membership>}
 *
 * @example
 * spark.membershipByRoomByEmail('Tm90aGluZyB0byBzZWUgaGVyZS4uLiBNb3ZlIGFsb25nLi4u', 'aperson@company.com')
 *   .then(function(membership) {
 *     console.log(membership.id);
 *   })
 *   .catch(function(err){
 *     console.log(err);
 *   });
 */
Spark.prototype.membershipByRoomByEmail = function(roomId, personEmail) {
  return this.request('get', 'memberships', {
      roomId: roomId,
      personEmail: personEmail
    })
   .then(res => this.toObject(res));
};

/**
 * Add new Spark Membership..
 *
 * @function
 * @param {String} roomId - Spark Room ID
 * @param {String} email - Email address of person to add
 * @param {Boolean} moderator - Boolean value to add as moderator
 * @returns {Promise.<Membership>}
 *
 * @example
 * spark.membershipAdd('Tm90aGluZyB0byBzZWUgaGVyZS4uLiBNb3ZlIGFsb25nLi4u', 'aperson@company.com')
 *   .then(function(membership) {
 *     console.log(membership.id);
 *   })
 *   .catch(function(err){
 *     console.log(err);
 *   });
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
 * Set a Membership as moderator.
 *
 * @function
 * @param {String} membershipId - Spark Membership ID
 * @returns {Promise.<Membership>}
 *
 * @example
 * spark.membershipSetModerator('Tm90aGluZyB0byBzZWUgaGVyZS4uLiBNb3ZlIGFsb25nLi4u')
 *   .then(function(membership) {
 *     console.log('%s is a moderator: %s', membership.personEmail, membership.isModerator);
 *   })
 *   .catch(function(err){
 *     console.log(err);
 *   });
 */
Spark.prototype.membershipSetModerator = function(membershipId) {
  return this.request('put', 'memberships', membershipId, { isModerator: true })
    .then(res => this.toObject(res));
};

/**
 * Remove a Membership as moderator.
 *
 * @function
 * @param {String} membershipId - Spark Membership ID
 * @returns {Promise.<Membership>}
 *
 * @example
 * spark.membershipClearModerator('Tm90aGluZyB0byBzZWUgaGVyZS4uLiBNb3ZlIGFsb25nLi4u')
 *   .then(function(membership) {
 *     console.log('%s is a moderator: %s', membership.personEmail, membership.isModerator);
 *   })
 *   .catch(function(err){
 *     console.log(err);
 *   });
 */
Spark.prototype.membershipClearModerator = function(membershipId) {
  return this.request('put', 'memberships', membershipId, { isModerator: false })
    .then(res => this.toObject(res));
};

/**
 * Remove Spark Membership by ID.
 *
 * @function
 * @param {String} membershipId - Spark Membership ID
 * @returns {Promise}
 *
 * @example
 * spark.membershipRemove('Tm90aGluZyB0byBzZWUgaGVyZS4uLiBNb3ZlIGFsb25nLi4u')
 *   .then(function() {
 *     console.log('Membership removed');
 *   })
 *   .catch(function(err){
 *     console.log(err);
 *   });
 */
Spark.prototype.membershipRemove = function(membershipId) {
  return this.request('delete', 'memberships', membershipId)
    .then(res => when(true));
};

/**
 * Return all Spark Webhooks registered to account.
 *
 * @function
 * @param {Integer} [max] - Number of records to return
 * @returns {Promise.<Array>}
 *
 * @example
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
 */
Spark.prototype.webhooksGet = function(maxResults) {
  return this.request('get', 'webhooks', { max: this.maxPageItems }, maxResults)
    .then(res => this.toArray(res));
};

/**
 * Return details of Spark Webhook by ID.
 *
 * @function
 * @param {String} webhookId - Spark Webhook ID
 * @returns {Promise.<Webhook>}
 *
 * @example
 * spark.webhookGet('Tm90aGluZyB0byBzZWUgaGVyZS4uLiBNb3ZlIGFsb25nLi4u')
 *   .then(function(webhook) {
 *     console.log(webhook.name);
 *   })
 *   .catch(function(err) {
 *     // process error
 *     console.log(err);
 *   });
 */
Spark.prototype.webhookGet = function(webhookId) {

  /**
   * Webhook Object
   *
   * @namespace Webhook
   * @property {string} id - Webhook ID
   * @property {string} name - Webhook name
   * @property {string} targetUrl - Webhook target URL
   * @property {boolean} resource - Webhook resource
   * @property {boolean} event - Webhook event
   * @property {boolean} filter - Webhook filter
   * @property {date} created - Date Webhook created
   */
  return this.request('get', 'webhooks', webhookId)
    .then(res => this.toObject(res));
};

/**
 * Add new Spark Webhook.
 *
 * @function
 * @param {String} resource - Resource for webhook
 * @param {String} event - Event for webhook
 * @param {String} name - Name assigned to webhook to add
 * @param {String} [roomId] - Spark Room ID
 * @returns {Promise.<Webhook>}
 *
 * @example
 * spark.webhookAdd('messages', 'created', 'mywebhook', 'Tm90aGluZyB0byBzZWUgaGVyZS4uLiBNb3ZlIGFsb25nLi4u')
 *   .then(function(webhook) {
 *     console.log(webhook.name);
 *   })
 *   .catch(function(err) {
 *     // process error
 *     console.log(err);
 *   });
 */
Spark.prototype.webhookAdd = function(resource, evt, name, roomId) {
  var config = {};

  // verify webhook url is defined
  if(!this.webhookUrl) {
    return when.reject(new Error('webhook url not specified'));
  }

  // validate resource types
  if(typeof resource !== 'string' || typeof evt !== 'string' || typeof name !== 'string') {
    return when.reject(new Error('invalid parameter types passed'));
  }

  // validate updated event is not passed for messages resource
  if(resource === 'messages' && evt === 'updated') {
    return when.reject(new Error('invalid event value passed'));
  }

  // validate delted event is not passed for rooms resource
  if(resource === 'rooms' && evt === 'deleted') {
    return when.reject(new Error('invalid event value passed'));
  }

  // validate resource values
  if(_.includes(['all', 'rooms', 'memberships', 'messages'], resource)) {
    config.resource = resource;
    config.targetUrl = this.webhookUrl;
    config.name = name || 'mywebhook';
  } else {
    return when.reject(new Error('invalid resource value passed'));
  }

  // validate event values
  if(_.includes(['all', 'created', 'updated', 'deleted'], evt)) {
    config.event = evt;
  } else {
    return when.reject(new Error('invalid event value passed'));
  }

  // add roomid for non "all" events
  if(evt !== 'all' && typeof roomId === 'string') {
    config.filter = 'roomId=' + roomId;
  }

  // setup webhook
  return this.request('post', 'webhooks', config)
    .then(res => this.toObject(res));
};

/**
 * Remove Spark Webhook by ID.
 *
 * @function
 * @param {String} webhookId
 * Spark Webhook ID.
 * @returns {Promise}
 *
 * @example
 * spark.webhookRemove('Tm90aGluZyB0byBzZWUgaGVyZS4uLiBNb3ZlIGFsb25nLi4u')
 *   .then(function() {
 *     console.log('Webhook removed');
 *   })
 *   .catch(function(err){
 *     console.log(err);
 *   });
 */
Spark.prototype.webhookRemove = function(webhookId) {
  return this.request('delete', 'webhooks', webhookId)
    .then(res => when(true));
};

module.exports = Spark;
