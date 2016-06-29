# node-sparky

#### Cisco Spark SDK for Node JS (Version 3)

```js
var Spark = require('node-sparky');

var spark = new Spark({ token: '<my token>' });

spark.roomsGet(10)
  .then(function(rooms) {
    // process rooms as array
    rooms.forEach(function(room) {
      console.log(room.title);
    });
  })
  .catch(function(err) {
    // process error
    console.log(err);
  });
```

***If you are coming from using node-sparky version 2.x or earlier, note that
the architecture, commands, and some variable names have changed. While this
release is similar to previous versions, there are some major differences.
Please read the API docs below before migrating your code to this release.
If you are looking for the old release version, node-sparky@2.0.27 is still
available to be installed through NPM.***

## Features

* Built in rate limiter and outbound queue that allows control over the number
of parallel API calls and the minimum time between each call.
* Transparently handles some (429, 500, 502) errors and re-queues the request.
* File processor for retrieving attachments from room.
* Event emitters tied to request, response, error, retry, and queue drops.
* Returns promises that comply with [A+ standards.](https://promisesaplus.com/).
* Handles pagination transparently. (Receive unlimited records)
* Support for Spark API Advanced Webhooks


## Installation

This module can be installed via NPM:
```bash
npm install node-sparky --save
```


# Reference

## API Initialization and Configuration

```js
var Spark = require('node-sparky');

var spark = new Spark({
  token: 'mytoken',
  webhookUrl: 'http://mywebhook.url/path',
});
```

* `token` : The Cisco Spark auth token
* `webhook` : The callback URL sent when setting up a webhook

**Optional config settings**

```js
var spark = new Spark({
  [...]
  maxConcurrent: 3,
  minTime: 600,
  requeueMinTime: 6000,
  requeueMaxRetry: 3
  requeueCodes: [ 429, 500, 503 ],
  requestTimeout: 20000,
  queueSize: 10000,
  requeueSize: 10000
});
```

* `maxConcurrent` : Number of requests that can be running at the same time.
  *Default: `3`*
* `minTime` : Time (ms) to wait after launching a request before launching
  another one. *Default: `600`ms (100/minute)*
* `requeueMinTime` : Time (ms) to wait after launching a request before
  launching another one for requeued requests. *Default: `minTime * 10`ms*
* `requeueMaxRetry:` : The maximum number of attepts to requeue the same API
  call. *Defaut: 3*
* `requeueCodes` : HTTP error codes that are attempted to be requeued.
  *Default: [ 429, 500, 503 ]*
* `requestTimeout` : The timeout (ms) that Spark waits for a connection to be
  accepted when placing an API call before failing. *Default: 20000ms*
* `queueSize` : Size of queue for requests that exceed rate limiter.
* `requeueSize` : Size of queue for requests that fail and need to be requeued.


## Events

#### Spark#on('dropped', function(droppedRequest) {});
Emitted when a request is dropped due to queue overflow.

#### Spark#on('request', function(request) {});
Emitted when Spark makes a request to the API.

#### Spark#on('response', function(response) {});
Emitted when Spark gets a response from the API.

#### Spark#on('retry', function(request) {});
Emitted when Spark has to retry a request.


## Tests

Tests are basic at this point... after cloning repo, run:

```bash
$ cd sparky
$ npm install
$ TOKEN=<token> npm test
```
