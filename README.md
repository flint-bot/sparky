# sparky


A simple Cisco Spark API wrapper for NodeJS.
```js
var Sparky = require('node-sparky');

var sparky = new Sparky({ token: '<my token>' });

sparky.rooms.get(function(err, results) {
  if(!err) console.log(results);
});

```


## Features

* Built in rate limiter and outbound queue that allows control over the number of parallel API calls and the minimum time between each call
* Transparently handles some (429, 500, 502) errors and re-queues the request
* File processor for retrieving attachments from room
* Event emitters tied to request, response, error, retry, and queue drops


## Installation

This module can be installed via NPM:
```bash
npm install node-sparky --save
```


# Reference

## API Initialization and Configuration

```js
var Sparky = require('node-sparky');

var sparky = new Sparky({
  token: 'mytoken',
  webhook: 'http://mywebhook.url/path',
});
```
* `token` : The Cisco Spark auth token
* `webhook` : The callback URL sent when setting up a webhook

**Optional config settings**

```js
var sparky = new Sparky({
  [...]
  maxItems: 10,
  maxConcurrent: 2,
  minTime: 200,
  requeueMinTime: 2000,
  requeueMaxRetry: 3
  requeueCodes: [ 429, 500, 503 ],
  requestTimeout: 5000,
  queueDepthTime: 20000,
  requeueDepthTime: 80000
});
```
* `maxItems` : Number of items that are retrieved. *Default: `50`*
* `maxConcurrent` : Number of requests that can be running at the same time. *Default: `2`*
* `minTime` : Time (ms) to wait after launching a request before launching another one. *Default: `200`ms*
* `requeueMinTime` : Time (ms) to wait after launching a request before launching another one for requeued requests. *Default: `minTime * 10`ms*
* `requeueMaxRetry:` : The maximum number of attepts to requeue the same API call.
* `requeueCodes` : HTTP error codes that are attempted to be requeued. *Default: [ 429, 500, 503 ]*
* `requestTimeout` : The timeout (ms) that Sparky waits for a connection to be accepted when placing an API call before failing. *Default: 5000ms*
* `queueDepthTime` : The time (ms) that Sparky will hold a request in the primary queue before dropping oldest. *Default: 20000ms*
* `requeueDepthTime` : The time (ms) that Sparky will hold a request in the in the retry queue before dropping oldest. *Default: `queueDepthTime * (requeueMinTime / minTime)` ms*

## Rooms

#### Get All (up to maxItems) Rooms:
Retrieve rooms that authenticated user has joined. Callback returns array of room objects.
###### SPARKY.rooms.get(callback(error, results))
* `error` : null or http response code
* `results` : query results in a collection (array of objects)
```js
sparky.rooms.get(function(err, results) {
  if(!err) {
    console.log(results);
  }
});
```


## Room

#### Get Details by ID:
Retrieve details of a specific room. Callback returns room object.
###### SPARKY.room.get(id, callback(error, results))
* `id` : UUID of a Spark Room
* `error` : null or http response code
* `results` : query results in a collection (array of objects)
```js
sparky.room.get(id, function(err, results) {
  if(!err) {
    console.log(results);
  }
});
```


#### Add:
Adds a room. Callback returns a room object.
###### SPARKY.room.add(title, callback(error, results))
* `title` : Title of room to add
* `error` : null or http response code
* `results` : query results in a collection (array of objects)
```js
sparky.room.add(title, function(err, results) {
  if(!err) {
    console.log(results);
  }
});
```


#### Rename:
Renames a room. Callback returns a room object.
###### SPARKY.room.rename(id, title, callback(error, results))
* `id` : UUID of a Spark Room
* `title` : Title of room to add
* `error` : null or http response code
* `results` : query results in a collection (array of objects)
```js
sparky.room.rename(id, title, function(err, results) {
  if(!err) {
    console.log(results);
  }
});
```


#### Remove:
Removes a room. Callback returns either a success or failure.
###### SPARKY.room.remove(id, callback(error, results))
* `id` : UUID of a Spark Room
* `error` : null or http response code
* `results` : query results in a collection (array of objects)
```js
sparky.room.remove(id, function(err) {
  if(!err) {
    console.log('room %s removed', id);
  }
});
```


#### Example Room Object:
```json
{
  "id" : "Y2lzY29zcGFyazovL3VzL1JPT00vYmJjZWIxYWQtNDNmMS0zYjU4LTkxNDctZjE0YmIwYzRkMTU0",
  "title" : "Project Unicorn - Sprint 0",
  "sipAddress" : "8675309@ciscospark.com",
  "created" : "2015-10-18T14:26:16+00:00"
}
```


## People

#### Search People by Name:
Retrieve people in organization by name. Callback returns array of person
objects.
###### SPARKY.people.search(name, callback(error, results))
* `name` : full or partial display name of a Spark User
* `error` : null or http response code
* `results` : query results in a collection (array of objects)
```js
sparky.people.search(name, function(err, results) {
  if(!err) {
    console.log(results);
  }
});
```


## Person

#### Get Details by ID:
Retrieve details of a specific Spark user by id. Callback returns person object.
###### SPARKY.person.get(id, callback(error, results))
* `id` : UUID of a Spark User
* `error` : null or http response code
* `results` : query results in a collection (array of objects)
```js
sparky.person.get(id, function(err, results) {
  if(!err) {
    console.log(results);
  }
});
```


#### Get Details by Email:
Retrieve details of a specific Spark user by email address. Callback returns
person object.
###### SPARKY.person.byEmail(email, callback(error, results))
* `email` : email address of a Spark User
* `error` : null or http response code
* `results` : query results in a collection (array of objects)
```js
sparky.person.byEmail(email, function(err, results) {
  if(!err) {
    console.log(results);
  }
});
```


#### Get Details of Self:
Retrieve details of the authenticated user. Callback returns person object.
###### SPARKY.person.me(callback(error, results))
* `error` : null or http response code
* `results` : query results in a collection (array of objects)
```js
sparky.person.me(function(err, results) {
  if(!err) {
    console.log(results);
  }
});
```


#### Example Person Object:
```json
{
  "id" : "OTZhYmMyYWEtM2RjYy0xMWU1LWExNTItZmUzNDgxOWNkYzlh",
  "emails" : [ "johnny.chang@foomail.com", "jchang@barmail.com" ],
  "displayName" : "John Andersen",
  "created" : "2015-10-18T14:26:16+00:00"
}
```


## Messages

#### Get All (up to max or maxItems) Messages for Room by ID:
Retrieve messages for a specified room. Callback returns array of message objects.
###### SPARKY.messages.room.get(roomId, *max,* callback(error, results))
* `roomId` : UUID of a Spark Room
* `max` : optionally specify max items to return (defaults to global maxItems)
* `error` : null or http response code
* `results` : query results in a collection (array of objects)
```js
sparky.messages.room.get(roomId, function(err, results) {
  if(!err) {
    console.log(results);
  }
});
```


## Message

#### Get Details by ID:
Retrieve details of a specific message by id. Callback returns message object.
###### SPARKY.message.get(id, callback(error, results))
* `id` : UUID of a Message
* `error` : null or http response code
* `results` : query results in a collection (array of objects)
```js
sparky.message.get(id, function(err, results) {
  if(!err) {
    console.log(results);
  }
});
```


#### Send Message to Room by ID:
Sends a message to a room. Callback returns message object.
###### SPARKY.message.send.room(roomId, {}, callback(error, results))
* `roomId` : UUID of a Spark Room
* `{}` : object with text and/or file properties
* `error` : null or http response code
* `results` : query results in a collection (array of objects)
```js
sparky.message.send.room(roomId, {
  text: 'Hello World!',
  file: 'http://ieatz/nom.gif'
}, function(err, results) {
  if(!err) {
    console.log(results);
  }
});
```


#### Send Message to Person by Email Address:
Sends a message to a person in a 1:1 room. Callback returns message object.
###### SPARKY.message.send.person(email, {}, callback(error, results))
* `email` : email address of a Spark User
* `{}` : object with text and/or file properties
* `error` : null or http response code
* `results` : query results in a collection (array of objects)
```js
sparky.message.send.person('person@domain.com', {
  text: 'Hello World!',
  file: 'http://ieatz/nom.gif'
}, function(err, results) {
  if(!err) {
    console.log(results);
  }
});
```


#### Remove Message by ID:
Removes a message. Callback returns either a success or failure.
###### SPARKY.message.remove(id, callback(error, results))
* `id` : UUID of a Message
* `error` : null or http response code
```js
sparky.message.remove(id, function(err) {
  if(!err) {
    console.log('message %s removed', id);
  }
});
```


#### Example Message Object:
```json
{
  "id" : "46ef3f0a-e810-460c-ad37-c161adb48195",
  "personId" : "49465565-f6db-432f-ab41-34b15f544a36",
  "personEmail" : "matt@example.com",
  "roomId" : "24aaa2aa-3dcc-11e5-a152-fe34819cdc9a",
  "text" : "PROJECT UPDATE - A new project project plan has been published on Box",
  "files" : [ "http://www.example.com/images/media.png" ],
  "created" : "2015-10-18T14:26:16+00:00"
}
```


## Contents
The Content API is designed to process file URLs in the message object responses. A message object would look something like this:

```js
{
  "id": "Y2BhLWE1ZTEtODE5vL3VzL01FUMTAtZWVlMy0xMWUlzY29zcGFyazo11NBR0UvOTgzOTNWZmMTlkYzk3",
  "roomId": "3VzLYTAtYTNiZS1JPT00xMWODY5OWZhY2lzY2U1LWI0v9zcGFyazovL3MjAtYzMzNjg0ZDdlODE0",
  "text": "This is a file...",
  "personId": "Y2lzY29zcGFyazovL3VzL1BFT1BMRS9mM2I0ZDNjOC1kMDhlLTQyM2UtODc1Yi1iMzcxZmE0Zjc1OWY",
  "files": [
    "https://api.ciscospark.com/v1/contents/c2MMWU1LWI03VzL0NPTlRFTlQvNDYTY4NTAtZWVkYy0xWIyYTk1MGMTEtY2lzY29zcGFyazovLFjMDcxLzA"
  ],  
  "personEmail": "something@somedomain.com",
  "created": "2016-03-20T21:34:58.353Z"
},
```

#### Get File by ID:
Retrieve file by ID
###### SPARKY.contents.get(id, callback(error, file))
* `id` : UUID of a File
* `error` : null or http response code
* `file` : object with file contents
```js
var id = 'c2MMWU1LWI03VzL0NPTlRFTlQvNDYTY4NTAtZWVkYy0xWIyYTk1MGMTEtY2lzY29zcGFyazovLFjMDcxLzA';

sparky.contents.get(id, function(err, file) {
  console.log('Filename: %s', file.name);
  console.log('Type: %s', file.type);

  fs.writeFile(file.name, file.binary, function(err) {
    if(err) {
      console.log(err);
    } else {
      console.log('done');
    }
  });
});
```



#### Get File by URL:
Retrieve file by API URL
###### SPARKY.contents.byUrl(url, callback(error, file))
* `url` : URL of a a file in a message object
* `error` : null or http response code
* `file` : object with file contents
```js
var url = 'https://api.ciscospark.com/v1/contents/c2MMWU1LWI03VzL0NPTlRFTlQvNDYTY4NTAtZWVkYy0xWIyYTk1MGMTEtY2lzY29zcGFyazovLFjMDcxLzA';

sparky.contents.byUrl(url, function(err, file) {
  console.log('Filename: %s', file.name);
  console.log('Type: %s', file.type);

  fs.writeFile(file.name, file.binary, function(err) {
    if(err) {
      console.log(err);
    } else {
      console.log('done');
    }
  });
});
```


#### Example File Object:
```json
{
  "id": "c2MMWU1LWI03VzL0NPTlRFTlQvNDYTY4NTAtZWVkYy0xWIyYTk1MGMTEtY2lzY29zcGFyazovLFjMDcxLzA",
  "name": "2016-03-06_19-03-57.jpg",
  "ext": "jpg",
  "type": "image/jpeg",
  "binary": "<Buffer ff d8... >",
  "base64": "/9j/4AAQSkZJ..."
}
```


## Memberships

#### Get All (up to maxItems) Room Memberships of Self:
Retrieve all room memberships for authenticated user. Callback returns array of
membership objects.
###### SPARKY.memberships.get(callback(error, results))
* `error` : null or http response code
* `results` : query results in a collection (array of objects)
```js
sparky.memberships.get(function(err, results) {
  if(!err) {
    console.log(results);
  }
});
```


#### Get All (up to maxItems) User Memberships of a Room:
Retrieve memberships by room id. Callback returns array of membership objects.
###### SPARKY.memberships.byRoom(roomId, callback(error, results))
* `roomId` : UUID of a Spark Room
* `error` : null or http response code
* `results` : query results in a collection (array of objects)
```js
sparky.memberships.byRoom(roomId, function(err, results) {
  if(!err) {
    console.log(results);
  }
});
```


## Membership

#### Get Details by ID:
Retrieve details of a specific membership by id. Callback returns membership
object.
###### SPARKY.membership.get(id, callback(error, results))
* `id` : UUID of a Membership
* `error` : null or http response code
* `results` : query results in a collection (array of objects)
```js
sparky.membership.get(id, function(err, results) {
  if(!err) {
    console.log(results);
  }
});
```


#### Get Details by ID:
Retrieve details of a specific membership by id. Callback returns membership
object.
###### SPARKY.membership.byRoomByEmail(id, email, callback(error, results))
* `id` : UUID of a Membership
* `email` : email address of a Spark User
* `error` : null or http response code
* `results` : query results in a collection (array of objects)
```js
sparky.membership.byRoomByEmail(id, email, function(err, results) {
  if(!err) {
    console.log(results);
  }
});
```


#### Add:
Adds a user membership to a room by email. Callback returns membership object.
###### SPARKY.membership.add(roomId, email, callback(error, results))
* `roomId` : UUID of a Spark Room
* `email` : email address of a Spark User
* `error` : null or http response code
* `results` : query results in a collection (array of objects)
```js
sparky.membership.add(roomId, email, function(err, results) {
  if(!err) {
    console.log(results);
  }
});
```


#### Add Moderator to Membership:
Enables a moderator privileges on a membership. Callback returns membership
object.
###### SPARKY.membership.set.moderator(id, callback(error, results))
* `id` : UUID of a Membership
* `error` : null or http response code
* `results` : query results in a collection (array of objects)
```js
sparky.membership.set.moderator(id, function(err, results) {
  if(!err) {
    console.log(results);
  }
});
```


#### Remove Moderator from Membership:
Disables a moderator privileges on a membership. Callback returns membership
object.
###### SPARKY.membership.clear.moderator(id, callback(error, results))
* `id` : UUID of a Membership
* `error` : null or http response code
* `results` : query results in a collection (array of objects)
```js
sparky.membership.clear.moderator(id, function(err, results) {
  if(!err) {
    console.log(results);
  }
});
```


#### Remove by ID:
Removes a membership. Callback returns either a success or failure.
###### SPARKY.membership.remove(id, callback(error))
* `id` : UUID of a Membership
* `error` : null or http response code
```js
sparky.membership.remove(id, function(err) {
  if(!err) {
    console.log('membership %s removed', id);
  }
});
```


#### Example Membership Object:
```json
{
  "id" : "Y2lzY29zcGFyazovL3VzL1JPT00vYmJjZWIxYWQtNDNmMS0zYjU4LTkxNDcEdsRkMTU0",
  "roomId" : "24aaa2aa3dcc11e5a152fe34819cdc9a",
  "personId" : "96abc2aa3dcc-11e5a152fe34819cdc9a",
  "personEmail" : "r2d2@example.com",
  "isModerator" : true,
  "created" : "2015-10-18T14:26:16+00:00"
}
```


## Webhooks

#### Get All (up to maxItems) Webhooks:
Retrieve all webhooks that the authenticated user has active in joined rooms.
Callback returns array of webhook objects.
###### SPARKY.webhooks.get(callback(error, results))
* `error` : null or http response code
* `results` : query results in a collection (array of objects)
```js
sparky.webhooks.get(function(err, results) {
  if(!err) {
    console.log(results);
  }
});
```


## Webhook

#### Get Details by ID:
Retrieve details of a webhook by its ID. Callback returns a webhook object.
###### SPARKY.webhook.get(id, callback(error, results))
* `id` : UUID of a webhook object
* `error` : null or http response code
* `results` : query results in a collection (array of objects)
```js
sparky.webhook.get(id, function(err, results) {
  if(!err) {
    console.log(results);
  }
});
```


#### Add:
Adds a "messages created" webhook in room by id. This webhook triggers whenever
a new message is posted into a room. Callback returns a webhook object.
###### SPARKY.webhook.add.messages.created.room(roomId, *name,* callback(error, results))
* `roomId` : UUID of a Spark Room
* `name` : optional name for webhook (else defaults to roomid)
* `error` : null or http response code
* `results` : query results in a collection (array of objects)
```js
sparky.webhook.add.messages.created.room(roomId, function(err, results) {
  if(!err) {
    console.log(results);
  }
});
```


#### Remove by ID:
Removes a webhook by its ID. Callback returns either a success or failure.
###### SPARKY.webhook.remove(id, callback(error))
* `id` : UUID of a webhook object
* `error` : null or http response code
```js
sparky.webhook.remove(id, function(err) {
  if(!err) {
    console.log('webhook %s removed', id);
  }
});
```


#### Example Webhook Object:
```json
{
  "id" : "96abc2aa-3dcc-11e5-a152-fe34819cdc9a",
  "name" : "My Awesome Webhook",
  "targetUrl" : "https://example.com/mywebhook",
  "resource" : "messages",
  "event" : "created",
  "filter" : "roomId=Y2lzY29zcGFyazovL3VzL1JPT00vYmJjZWIxYWQtNDNmMS0zYjU4LTkx",
  "created" : "2015-10-18T14:26:16+00:00"
}
```


## Events

The following events can be used to drive debugging or metrics.

**Debug Example:**

```js
sparky.on('request', function(requestOptions) {
  console.log('options: %j', requestOptions || '<empty>');  
});

sparky.on('response', function(response) {
  console.log('response: %j', response || '<empty>'); 
});

sparky.on('retry', function(response) {
  console.log('retry: %j', response || '<empty>'); 
});

sparky.on('error', function(err) {
  console.log('%s', err || '<empty>');
});

sparky.on('dropped', function(request) {
  console.log('queue size exceeded, dropping oldest request: %j', request);
});
```

**Metric Example:**

```js
var reqPerMin = 0;
var avgResTime = 0;

sparky.on('response', function(response) {
   reqPerMin++;
   avgResTime = Math.floor(((avgResTime * reqPerMin) + response.elapsedTime) / (reqPerMin + 1));
});

setInterval(function() {
  console.log('Requests per minute: %s', reqPerMin);
  console.log('Average Response time: %s', avgResTime);
  reqPerMin = 0;
  avgResTime = 0;
  }, 60 * 1000);
```

## Tests

Tests are basic at this point... after cloning repo, run:

```bash
$ cd sparky
$ npm install
$ TOKEN=<token> npm test
```
