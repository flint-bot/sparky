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
Please read the API docs below and in the /docs folder before migrating your
code to this release. If you are looking for the old release version,
node-sparky@2.0.27 is still available to be installed through NPM.***

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

## Spark Methods
##### Note: [Detailed documentation for Spark Methods can be found here.](https://github.com/nmarus/sparky/blob/master/docs/Spark.md)

#### Spark#roomsGet();
Returns Promise fulfilled with Rooms array.

#### Spark#roomGet(id);
Returns Promise fulfilled with Room object.

#### Spark#roomAdd(title);
Returns Promise fulfilled with Room object.

#### Spark#roomRename(id, title);
Returns Promise fulfilled with Room object.

#### Spark#roomRemove(id);
Returns Promise fulfilled on completion.

##### Example Room Object
```json
{
  "id" : "Tm90aGluZyB0byBzZWUgaGVyZS4uLiBNb3ZlIGFsb25nLi4u",
  "title" : "Project Unicorn - Sprint 0",
  "type" : "group",
  "isLocked" : false,
  "lastActivity" : "2015-10-18T14:26:16+00:00",
  "created" : "2015-10-18T14:26:16+00:00"
}
```

#### Spark#peopleSearch(searchString, max);
Returns Promise fulfilled with Persons array.

#### Spark#personGet(id);
Returns Promise fulfilled with Person object.

#### Spark#personMe();
Returns Promise fulfilled with Person object.

#### Spark#personByEmail(email)
Returns Promise fulfilled with Person object.

##### Example Person Object
```json
{
  "id" : "Tm90aGluZyB0byBzZWUgaGVyZS4uLiBNb3ZlIGFsb25nLi4u",
  "emails" : [ "johnny.chang@foomail.com", "jchang@barmail.com" ],
  "displayName" : "John Andersen",
  "created" : "2015-10-18T14:26:16+00:00"
}
```

#### Spark#messagesGet(roomId, max);
Returns Promise fulfilled with Messages array.

#### Spark#messageGet(id);
Returns Promise fulfilled with Message object.

#### Spark#messageSendPerson(email, messageSendObject);
Returns Promise fulfilled with Message object.

#### Spark#messageSendRoom(roomId, messageSendObject);
Returns Promise fulfilled with Message object.

##### Example MessageSend Object
```json
{
  "text" : "Hello.",
  "file" : "http://mydomain.com/myfile.doc",
}
```

##### Example Message Response Object
```json
{
  "id" : "Tm90aGluZyB0byBzZWUgaGVyZS4uLiBNb3ZlIGFsb25nLi4u",
  "personId" : "Tm90aGluZyB0byBzZWUgaGVyZS4uLiBNb3ZlIGFsb25nLi4u",
  "personEmail" : "matt@example.com",
  "roomId" : "Tm90aGluZyB0byBzZWUgaGVyZS4uLiBNb3ZlIGFsb25nLi4u",
  "text" : "PROJECT UPDATE - A new project project plan has been published on Box",
  "files" : [ "http://api.ciscospark.com/v1/contents/Tm90aGluZyB0byBzZWUgaGVyZS4uLiBNb3ZlIGFsb25nLi4u" ],
  "created" : "2015-10-18T14:26:16+00:00"
}
```

#### Spark#messageRemove(id);
Returns Promise fulfilled on completion.

#### Spark#contentGet(id);
Returns Promise fulfilled with File object.

#### Spark#contentGetByUrl(url);
Returns Promise fulfilled with File object.

##### Example File Object
```json
{
  "id": "Tm90aGluZyB0byBzZWUgaGVyZS4uLiBNb3ZlIGFsb25nLi4u",
  "name": "2016-03-06_19-03-57.jpg",
  "ext": "jpg",
  "type": "image/jpeg",
  "binary": "<Buffer ff d8... >",
  "base64": "/9j/4AAQSkZJ..."
}
```

#### Spark#membershipsGet(max);
Returns Promise fulfilled with memberships array.

#### Spark#membershipsByRoom(roomId, max);
Returns Promise fulfilled with memberships array.

#### Spark#membershipGet(id);
Returns Promise fulfilled with membership object.

#### Spark#membershipByRoomByEmail(roomId, email);
Returns Promise fulfilled with membership object.

#### Spark#membershipAdd(roomId, email, moderator);
Returns Promise fulfilled with membership object.

#### Spark#membershipSetModerator(id);
Returns Promise fulfilled with membership object.

#### Spark#membershipClearModerator(id);
Returns Promise fulfilled with membership object.

#### Spark#membershipRemove(id);
Returns Promise fulfilled on completion.

##### Example Membership Object
```json
{
  "id" : "Tm90aGluZyB0byBzZWUgaGVyZS4uLiBNb3ZlIGFsb25nLi4u",
  "roomId" : "Tm90aGluZyB0byBzZWUgaGVyZS4uLiBNb3ZlIGFsb25nLi4u",
  "personId" : "Tm90aGluZyB0byBzZWUgaGVyZS4uLiBNb3ZlIGFsb25nLi4u",
  "personEmail" : "r2d2@example.com",
  "isModerator" : true,
  "isMonitor" : false,
  "created" : "2015-10-18T14:26:16+00:00"
}
```

#### Spark#webhooksGet(max);
Returns Promise fulfilled with webhooks array.

#### Spark#webhookGet(id);
Returns Promise fulfilled with webhook object.

#### Spark#webhookAdd(resource, event, name, roomId);
Returns Promise fulfilled with webhook object.

#### Spark#webhookRemove(id);
Returns Promise fulfilled on completion.

##### Example Webhook Object
```json
{
  "id" : "Tm90aGluZyB0byBzZWUgaGVyZS4uLiBNb3ZlIGFsb25nLi4u",
  "name" : "My Awesome Webhook",
  "targetUrl" : "https://example.com/mywebhook",
  "resource" : "messages",
  "event" : "created",
  "filter" : "roomId=Tm90aGluZyB0byBzZWUgaGVyZS4uLiBNb3ZlIGFsb25nLi4u",
  "created" : "2015-10-18T14:26:16+00:00"
}
```


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
$ cd node-sparky
$ npm install
$ TOKEN=<token> npm test
```


## License

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Lesser General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU Lesser General Public License for more details.

You should have received a copy of the GNU Lesser General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.
