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
* Support Teams API


## Installation

This module can be installed via NPM:
```bash
npm install node-sparky --save
```


# Reference

## Initialization and Configuration

```js
var Spark = require('node-sparky');

var spark = new Spark({
  token: 'mytoken',
  webhookUrl: 'http://mywebhook.url/path',
});
```
