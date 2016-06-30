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
## Objects

<dl>
<dt><a href="#Spark">Spark</a> : <code>object</code></dt>
<dd><p>Creates a Spark API instance that is then attached to a Spark Account.</p>
</dd>
<dt><a href="#Person">Person</a> : <code>object</code></dt>
<dd><p>Person Object</p>
</dd>
<dt><a href="#Message">Message</a> : <code>object</code></dt>
<dd><p>Message Object</p>
</dd>
<dt><a href="#File">File</a> : <code>object</code></dt>
<dd><p>File Object</p>
</dd>
<dt><a href="#Validator">Validator</a> : <code>object</code></dt>
<dd><p>Spark Validation.</p>
</dd>
</dl>

## Events

<dl>
<dt><a href="#event_drop">"drop"</a></dt>
<dd><p>Spark Queue Drop Event.</p>
</dd>
<dt><a href="#event_request">"request"</a></dt>
<dd><p>Spark request event.</p>
</dd>
<dt><a href="#event_reponse">"reponse"</a></dt>
<dd><p>Spark response event.</p>
</dd>
<dt><a href="#event_retry">"retry"</a></dt>
<dd><p>Spark retry event.</p>
</dd>
</dl>

<a name="Spark"></a>

## Spark : <code>object</code>
Creates a Spark API instance that is then attached to a Spark Account.

**Kind**: global namespace  
**Throw**: <code>Error</code> Throws on spark token missing in options object.  

| Param | Type | Description |
| --- | --- | --- |
| options | <code>Object</code> | Configuration object containing Spark settings. |


* [Spark](#Spark) : <code>object</code>
    * _instance_
        * [.roomsGet([max])](#Spark+roomsGet) ⇒ <code>Promise.&lt;Array&gt;</code>
        * [.roomsDirect([max])](#Spark+roomsDirect) ⇒ <code>Promise.&lt;Array&gt;</code>
        * [.roomsGroup([max])](#Spark+roomsGroup) ⇒ <code>Promise.&lt;Array&gt;</code>
        * [.roomsByTeam(teamId, [max])](#Spark+roomsByTeam) ⇒ <code>Promise.&lt;Array&gt;</code>
        * [.roomGet(roomId)](#Spark+roomGet) ⇒ <code>Promise.&lt;Room&gt;</code>
        * [.roomAdd(title)](#Spark+roomAdd) ⇒ <code>Promise.&lt;Room&gt;</code>
        * [.roomRename(roomId, title)](#Spark+roomRename) ⇒ <code>Promise.&lt;Room&gt;</code>
        * [.roomRemove(roomId)](#Spark+roomRemove) ⇒ <code>Promise</code>
        * [.peopleSearch(displayName, [max])](#Spark+peopleSearch) ⇒ <code>Promise.&lt;Array&gt;</code>
        * [.personGet(personId)](#Spark+personGet) ⇒ <code>[Promise.&lt;Person&gt;](#Person)</code>
        * [.personMe()](#Spark+personMe) ⇒ <code>[Promise.&lt;Person&gt;](#Person)</code>
        * [.personByEmail(email)](#Spark+personByEmail) ⇒ <code>[Promise.&lt;Person&gt;](#Person)</code>
        * [.messagesGet(roomId, [max])](#Spark+messagesGet) ⇒ <code>Promise.&lt;Array&gt;</code>
        * [.messageGet(Message)](#Spark+messageGet) ⇒ <code>[Promise.&lt;Message&gt;](#Message)</code>
        * [.messageSendPerson(email)](#Spark+messageSendPerson) ⇒ <code>[Promise.&lt;Message&gt;](#Message)</code>
        * [.messageSendRoom(roomId)](#Spark+messageSendRoom) ⇒ <code>[Promise.&lt;Message&gt;](#Message)</code>
        * [.messageRemove(messageId)](#Spark+messageRemove) ⇒ <code>Promise</code>
        * [.contentGet(id)](#Spark+contentGet) ⇒ <code>[Promise.&lt;File&gt;](#File)</code>
        * [.contentByUrl(url)](#Spark+contentByUrl) ⇒ <code>[Promise.&lt;File&gt;](#File)</code>
        * [.teamsGet([max])](#Spark+teamsGet) ⇒ <code>Promise.&lt;Array&gt;</code>
        * [.teamGet(teamId)](#Spark+teamGet) ⇒ <code>Promise.&lt;Team&gt;</code>
        * [.teamAdd(name)](#Spark+teamAdd) ⇒ <code>Promise.&lt;Team&gt;</code>
        * [.teamRoomAdd(teamId, title)](#Spark+teamRoomAdd) ⇒ <code>Promise.&lt;Room&gt;</code>
        * [.teamRename(teamId, name)](#Spark+teamRename) ⇒ <code>Promise.&lt;Team&gt;</code>
        * [.teamRemove(teamId)](#Spark+teamRemove) ⇒ <code>Promise</code>
        * [.teamMembershipsGet(teamId, [max])](#Spark+teamMembershipsGet) ⇒ <code>Promise.&lt;Array&gt;</code>
        * [.teamMembershipGet(membershipId)](#Spark+teamMembershipGet) ⇒ <code>Promise.&lt;Membership&gt;</code>
        * [.teamMembershipAdd(teamId, email, moderator)](#Spark+teamMembershipAdd) ⇒ <code>Promise.&lt;Membership&gt;</code>
        * [.teamMembershipSetModerator(membershipId)](#Spark+teamMembershipSetModerator) ⇒ <code>Promise.&lt;Membership&gt;</code>
        * [.teamMembershipClearModerator(membershipId)](#Spark+teamMembershipClearModerator) ⇒ <code>Promise.&lt;Membership&gt;</code>
        * [.teamMembershipRemove(membershipId)](#Spark+teamMembershipRemove) ⇒ <code>Promise</code>
        * [.membershipsGet([max])](#Spark+membershipsGet) ⇒ <code>Promise.&lt;Array&gt;</code>
        * [.membershipsByRoom(roomId, [max])](#Spark+membershipsByRoom) ⇒ <code>Promise.&lt;Array&gt;</code>
        * [.membershipGet(membershipId)](#Spark+membershipGet) ⇒ <code>Promise.&lt;Membership&gt;</code>
        * [.membershipByRoomByEmail(roomId, personEmail)](#Spark+membershipByRoomByEmail) ⇒ <code>Promise.&lt;Membership&gt;</code>
        * [.membershipAdd(roomId, email, moderator)](#Spark+membershipAdd) ⇒ <code>Promise.&lt;Membership&gt;</code>
        * [.membershipSetModerator(membershipId)](#Spark+membershipSetModerator) ⇒ <code>Promise.&lt;Membership&gt;</code>
        * [.membershipClearModerator(membershipId)](#Spark+membershipClearModerator) ⇒ <code>Promise.&lt;Membership&gt;</code>
        * [.membershipRemove(membershipId)](#Spark+membershipRemove) ⇒ <code>Promise</code>
        * [.webhooksGet([max])](#Spark+webhooksGet) ⇒ <code>Promise.&lt;Array&gt;</code>
        * [.webhookGet(webhookId)](#Spark+webhookGet) ⇒ <code>Promise.&lt;Webhook&gt;</code>
        * [.webhookAdd(resource, event, [name], roomId)](#Spark+webhookAdd) ⇒ <code>Promise.&lt;Webhook&gt;</code>
        * [.webhookRemove(webhookId)](#Spark+webhookRemove) ⇒ <code>Promise</code>
    * _static_
        * [.options](#Spark.options) : <code>object</code>

<a name="Spark+roomsGet"></a>

### spark.roomsGet([max]) ⇒ <code>Promise.&lt;Array&gt;</code>
Return all Spark Rooms registered to account.

**Kind**: instance method of <code>[Spark](#Spark)</code>  
**Returns**: <code>Promise.&lt;Array&gt;</code> - Promise fulfilled with array of Room objects.  

| Param | Type | Description |
| --- | --- | --- |
| [max] | <code>Integer</code> | Number of records to return. |

**Example**  
```js
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
<a name="Spark+roomsDirect"></a>

### spark.roomsDirect([max]) ⇒ <code>Promise.&lt;Array&gt;</code>
Return all Spark 1:1 Rooms.

**Kind**: instance method of <code>[Spark](#Spark)</code>  
**Returns**: <code>Promise.&lt;Array&gt;</code> - Promise fulfilled with array of Room objects.  

| Param | Type | Description |
| --- | --- | --- |
| [max] | <code>Integer</code> | Number of records to return. |

**Example**  
```js
spark.roomsDirect(10)
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
<a name="Spark+roomsGroup"></a>

### spark.roomsGroup([max]) ⇒ <code>Promise.&lt;Array&gt;</code>
Return all Spark Group Rooms.

**Kind**: instance method of <code>[Spark](#Spark)</code>  
**Returns**: <code>Promise.&lt;Array&gt;</code> - Promise fulfilled with array of Room objects.  

| Param | Type | Description |
| --- | --- | --- |
| [max] | <code>Integer</code> | Number of records to return. |

**Example**  
```js
spark.roomsGroup(10)
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
<a name="Spark+roomsByTeam"></a>

### spark.roomsByTeam(teamId, [max]) ⇒ <code>Promise.&lt;Array&gt;</code>
Return all Spark Rooms for a particular Team ID.

**Kind**: instance method of <code>[Spark](#Spark)</code>  
**Returns**: <code>Promise.&lt;Array&gt;</code> - Promise fulfilled with array of Room objects.  

| Param | Type | Description |
| --- | --- | --- |
| teamId | <code>String</code> | The Spark Team ID. |
| [max] | <code>Integer</code> | Number of records to return. |

**Example**  
```js
spark.roomsByTeam('Tm90aGluZyB0byBzZWUgaGVyZS4uLiBNb3ZlIGFsb25nLi4u', 10)
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
<a name="Spark+roomGet"></a>

### spark.roomGet(roomId) ⇒ <code>Promise.&lt;Room&gt;</code>
Return details of Spark Room by ID.

**Kind**: instance method of <code>[Spark](#Spark)</code>  
**Returns**: <code>Promise.&lt;Room&gt;</code> - Promise fulfilled with Room object.  

| Param | Type | Description |
| --- | --- | --- |
| roomId | <code>String</code> | Spark Room ID. |

**Example**  
```js
spark.roomGet('Tm90aGluZyB0byBzZWUgaGVyZS4uLiBNb3ZlIGFsb25nLi4u')
  .then(function(room) {
    console.log(room.title);
  })
  .catch(function(err) {
    // process error
    console.log(err);
  });
```
<a name="Spark+roomAdd"></a>

### spark.roomAdd(title) ⇒ <code>Promise.&lt;Room&gt;</code>
Add new Spark Room.

**Kind**: instance method of <code>[Spark](#Spark)</code>  
**Returns**: <code>Promise.&lt;Room&gt;</code> - Promise fulfilled with Room object.  

| Param | Type | Description |
| --- | --- | --- |
| title | <code>String</code> | Title for new Room. |

**Example**  
```js
spark.roomAdd('myroom')
  .then(function(room) {
    console.log(room.title);
  })
  .catch(function(err) {
    // process error
    console.log(err);
  });
```
<a name="Spark+roomRename"></a>

### spark.roomRename(roomId, title) ⇒ <code>Promise.&lt;Room&gt;</code>
Rename Spark Room.

**Kind**: instance method of <code>[Spark](#Spark)</code>  
**Returns**: <code>Promise.&lt;Room&gt;</code> - Promise fulfilled with Room object.  

| Param | Type | Description |
| --- | --- | --- |
| roomId | <code>String</code> | Spark Room ID |
| title | <code>String</code> | Title for new Room. |

**Example**  
```js
spark.roomRename('Tm90aGluZyB0byBzZWUgaGVyZS4uLiBNb3ZlIGFsb25nLi4u', 'myroom2')
  .then(function(room) {
    console.log(room.title);
  })
  .catch(function(err) {
    // process error
    console.log(err);
  });
```
<a name="Spark+roomRemove"></a>

### spark.roomRemove(roomId) ⇒ <code>Promise</code>
Remove Spark Room by ID.

**Kind**: instance method of <code>[Spark](#Spark)</code>  
**Returns**: <code>Promise</code> - Promise fulfilled on delete.  

| Param | Type | Description |
| --- | --- | --- |
| roomId | <code>String</code> | Spark Room ID. |

**Example**  
```js
spark.roomRemove('Tm90aGluZyB0byBzZWUgaGVyZS4uLiBNb3ZlIGFsb25nLi4u')
  .then(function() {
    console.log('Room removed.');
  })
  .catch(function(err) {
    // process error
    console.log(err);
  });
```
<a name="Spark+peopleSearch"></a>

### spark.peopleSearch(displayName, [max]) ⇒ <code>Promise.&lt;Array&gt;</code>
Search Spark for People by display name.

**Kind**: instance method of <code>[Spark](#Spark)</code>  
**Returns**: <code>Promise.&lt;Array&gt;</code> - Promise fulfilled with array of Message objects.  

| Param | Type | Description |
| --- | --- | --- |
| displayName | <code>String</code> | Search String to find as display name. |
| [max] | <code>Integer</code> | Number of records to return. |

**Example**  
```js
spark.peopleSearch('John', 10)
  .then(function(people) {
    // process people as array
    people.forEach(function(person) {
      console.log(person.displayName);
    });
  })
  .catch(function(err) {
    // process error
    console.log(err);
  });
```
<a name="Spark+personGet"></a>

### spark.personGet(personId) ⇒ <code>[Promise.&lt;Person&gt;](#Person)</code>
Return details of Spark User by ID.

**Kind**: instance method of <code>[Spark](#Spark)</code>  
**Returns**: <code>[Promise.&lt;Person&gt;](#Person)</code> - Promise fulfilled with Person object.  

| Param | Type | Description |
| --- | --- | --- |
| personId | <code>String</code> | Spark Person ID. |

**Example**  
```js
spark.personGet('Tm90aGluZyB0byBzZWUgaGVyZS4uLiBNb3ZlIGFsb25nLi4u')
  .then(function(person) {
    console.log(person.displayName);
  })
  .catch(function(err) {
    // process error
    console.log(err);
  });
```
<a name="Spark+personMe"></a>

### spark.personMe() ⇒ <code>[Promise.&lt;Person&gt;](#Person)</code>
Return details of Spark User that has authenticated.

**Kind**: instance method of <code>[Spark](#Spark)</code>  
**Returns**: <code>[Promise.&lt;Person&gt;](#Person)</code> - Promise fulfilled with Person object.  
**Example**  
```js
spark.personMe()
  .then(function(person) {
    console.log(person.displayName);
  })
  .catch(function(err) {
    // process error
    console.log(err);
  });
```
<a name="Spark+personByEmail"></a>

### spark.personByEmail(email) ⇒ <code>[Promise.&lt;Person&gt;](#Person)</code>
Return details of Spark User by Email.

**Kind**: instance method of <code>[Spark](#Spark)</code>  
**Returns**: <code>[Promise.&lt;Person&gt;](#Person)</code> - Promise fulfilled with Person object.  

| Param | Type | Description |
| --- | --- | --- |
| email | <code>String</code> | Email address of Spark User. |

**Example**  
```js
spark.personByEmail('aperson@company.com')
  .then(function(person) {
    console.log(person.displayName);
  })
  .catch(function(err) {
    // process error
    console.log(err);
  });
```
<a name="Spark+messagesGet"></a>

### spark.messagesGet(roomId, [max]) ⇒ <code>Promise.&lt;Array&gt;</code>
Return messages in a Spark Room.

**Kind**: instance method of <code>[Spark](#Spark)</code>  
**Returns**: <code>Promise.&lt;Array&gt;</code> - Promise fulfilled with array of Message objects.  

| Param | Type | Description |
| --- | --- | --- |
| roomId | <code>String</code> | Spark Room ID. |
| [max] | <code>Integer</code> | Number of records to return. |

**Example**  
```js
spark.messagesGet('Tm90aGluZyB0byBzZWUgaGVyZS4uLiBNb3ZlIGFsb25nLi4u', 100)
  .then(function(messages) {
    // process messages as array
    messages.forEach(function(message) {
      console.log(message.text);
    });
  })
  .catch(function(err) {
    // process error
    console.log(err);
  });
```
<a name="Spark+messageGet"></a>

### spark.messageGet(Message) ⇒ <code>[Promise.&lt;Message&gt;](#Message)</code>
Return details of Spark Message by ID.

**Kind**: instance method of <code>[Spark](#Spark)</code>  
**Returns**: <code>[Promise.&lt;Message&gt;](#Message)</code> - Promise fulfilled with Message object.  

| Param | Type | Description |
| --- | --- | --- |
| Message | <code>String</code> | ID Spark Message ID. |

**Example**  
```js
spark.messageGet('Tm90aGluZyB0byBzZWUgaGVyZS4uLiBNb3ZlIGFsb25nLi4u', 100)
  .then(function(message) {
    console.log(message.text);
  })
  .catch(function(err) {
    // process error
    console.log(err);
  });
```
<a name="Spark+messageSendPerson"></a>

### spark.messageSendPerson(email) ⇒ <code>[Promise.&lt;Message&gt;](#Message)</code>
Sends 1:1 Spark message to a person.

**Kind**: instance method of <code>[Spark](#Spark)</code>  
**Returns**: <code>[Promise.&lt;Message&gt;](#Message)</code> - Promise fulfilled with Message object.  

| Param | Type | Description |
| --- | --- | --- |
| email | <code>String</code> | Email address of Spark User |

**Example**  
```js
spark.messageSendPerson('aperson@company.com', {
    text: 'Hello!',
    files: ['http://company.com/myfile.doc']
  })
  .then(function(message {
    console.log('Message sent: %s', message.txt) ;
  })
  .catch(function(err){
    console.log(err);
  });
```
<a name="Spark+messageSendRoom"></a>

### spark.messageSendRoom(roomId) ⇒ <code>[Promise.&lt;Message&gt;](#Message)</code>
Sends Spark message to a room.

**Kind**: instance method of <code>[Spark](#Spark)</code>  
**Returns**: <code>[Promise.&lt;Message&gt;](#Message)</code> - Promise fulfilled with Message object.  

| Param | Type | Description |
| --- | --- | --- |
| roomId | <code>String</code> | Spark Room ID. |

**Example**  
```js
spark.messageSendRoom('Tm90aGluZyB0byBzZWUgaGVyZS4uLiBNb3ZlIGFsb25nLi4u', {
    text: 'Hello!',
    files: ['http://company.com/myfile.doc']
  })
  .then(function(message {
    console.log('Message sent: %s', message.txt);
  })
  .catch(function(err){
    console.log(err);
  });
```
<a name="Spark+messageRemove"></a>

### spark.messageRemove(messageId) ⇒ <code>Promise</code>
Remove Spark Message by ID.

**Kind**: instance method of <code>[Spark](#Spark)</code>  
**Returns**: <code>Promise</code> - Promise fulfilled on delete.  

| Param | Type | Description |
| --- | --- | --- |
| messageId | <code>String</code> | Spark Message ID. |

**Example**  
```js
spark.messageRemove('Tm90aGluZyB0byBzZWUgaGVyZS4uLiBNb3ZlIGFsb25nLi4u')
  .then(function() {
    console.log('Message removed.');
  })
  .catch(function(err){
    console.log(err);
  });
```
<a name="Spark+contentGet"></a>

### spark.contentGet(id) ⇒ <code>[Promise.&lt;File&gt;](#File)</code>
Return details of Spark File by Content ID.

**Kind**: instance method of <code>[Spark](#Spark)</code>  
**Returns**: <code>[Promise.&lt;File&gt;](#File)</code> - Promise fulfilled with File object.  

| Param | Type | Description |
| --- | --- | --- |
| id | <code>String</code> | Spark Content ID. |

**Example**  
```js
spark.contentGet('Tm90aGluZyB0byBzZWUgaGVyZS4uLiBNb3ZlIGFsb25nLi4u')
  .then(function(file) {
    console.log('File name: %s', file.name);
  })
  .catch(function(err){
    console.log(err);
  });
```
<a name="Spark+contentByUrl"></a>

### spark.contentByUrl(url) ⇒ <code>[Promise.&lt;File&gt;](#File)</code>
Return details of Spark File by Spark Content URL.

**Kind**: instance method of <code>[Spark](#Spark)</code>  
**Returns**: <code>[Promise.&lt;File&gt;](#File)</code> - Promise fulfilled with File object.  

| Param | Type | Description |
| --- | --- | --- |
| url | <code>String</code> | Spark Content URL. |

**Example**  
```js
spark.contentByUrl('http://api.ciscospark.com/v1/contents/Tm90aGluZyB0byBzZWUgaGVyZS4uLiBNb3ZlIGFsb25nLi4u')
  .then(function(file) {
    console.log('File name: %s', file.name);
  })
  .catch(function(err){
    console.log(err);
  });
```
<a name="Spark+teamsGet"></a>

### spark.teamsGet([max]) ⇒ <code>Promise.&lt;Array&gt;</code>
Return all Spark Teams registered to account.

**Kind**: instance method of <code>[Spark](#Spark)</code>  
**Returns**: <code>Promise.&lt;Array&gt;</code> - Promise fulfilled with array of Team objects.  

| Param | Type | Description |
| --- | --- | --- |
| [max] | <code>Integer</code> | Number of records to return. |

**Example**  
```js
spark.teamsGet(10)
  .then(function(teams) {
    // process teams as array
    teams.forEach(function(team) {
      console.log(team.name);
    });
  })
  .catch(function(err) {
    // process error
    console.log(err);
  });
```
<a name="Spark+teamGet"></a>

### spark.teamGet(teamId) ⇒ <code>Promise.&lt;Team&gt;</code>
Return details of Spark Team by ID.

**Kind**: instance method of <code>[Spark](#Spark)</code>  
**Returns**: <code>Promise.&lt;Team&gt;</code> - Promise fulfilled with Team object.  

| Param | Type | Description |
| --- | --- | --- |
| teamId | <code>String</code> | Spark Team ID. |

**Example**  
```js
spark.teamGet('Tm90aGluZyB0byBzZWUgaGVyZS4uLiBNb3ZlIGFsb25nLi4u')
  .then(function(team) {
    console.log(team.name);
  })
  .catch(function(err) {
    // process error
    console.log(err);
  });
```
<a name="Spark+teamAdd"></a>

### spark.teamAdd(name) ⇒ <code>Promise.&lt;Team&gt;</code>
Add new Spark Team.

**Kind**: instance method of <code>[Spark](#Spark)</code>  
**Returns**: <code>Promise.&lt;Team&gt;</code> - Promise fulfilled with Team object.  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>String</code> | Name for new Team. |

**Example**  
```js
spark.teamAdd('myteam')
  .then(function(team) {
    console.log(team.name);
  })
  .catch(function(err) {
    // process error
    console.log(err);
  });
```
<a name="Spark+teamRoomAdd"></a>

### spark.teamRoomAdd(teamId, title) ⇒ <code>Promise.&lt;Room&gt;</code>
Add new Spark Team Room.

**Kind**: instance method of <code>[Spark](#Spark)</code>  
**Returns**: <code>Promise.&lt;Room&gt;</code> - Promise fulfilled with Room object.  

| Param | Type | Description |
| --- | --- | --- |
| teamId | <code>String</code> | Spark Team ID. |
| title | <code>String</code> | Title for new Room. |

**Example**  
```js
spark.teamRoomAdd('Tm90aGluZyB0byBzZWUgaGVyZS4uLiBNb3ZlIGFsb25nLi4u', 'myroom')
  .then(function(room) {
    console.log(room.title);
  })
  .catch(function(err) {
    // process error
    console.log(err);
  });
```
<a name="Spark+teamRename"></a>

### spark.teamRename(teamId, name) ⇒ <code>Promise.&lt;Team&gt;</code>
Rename a Spark Team.

**Kind**: instance method of <code>[Spark](#Spark)</code>  
**Returns**: <code>Promise.&lt;Team&gt;</code> - Promise fulfilled with Team object.  

| Param | Type | Description |
| --- | --- | --- |
| teamId | <code>String</code> | Spark Team ID |
| name | <code>String</code> | Name for new Team. |

**Example**  
```js
spark.teamRename('Tm90aGluZyB0byBzZWUgaGVyZS4uLiBNb3ZlIGFsb25nLi4u', 'myteam2')
  .then(function(team) {
    console.log(team.name);
  })
  .catch(function(err) {
    // process error
    console.log(err);
  });
```
<a name="Spark+teamRemove"></a>

### spark.teamRemove(teamId) ⇒ <code>Promise</code>
Remove Spark Team by ID.

**Kind**: instance method of <code>[Spark](#Spark)</code>  
**Returns**: <code>Promise</code> - Promise fulfilled on delete.  

| Param | Type | Description |
| --- | --- | --- |
| teamId | <code>String</code> | Spark Team ID. |

**Example**  
```js
spark.teamRemove('Tm90aGluZyB0byBzZWUgaGVyZS4uLiBNb3ZlIGFsb25nLi4u')
  .then(function() {
    console.log('Team removed.');
  })
  .catch(function(err) {
    // process error
    console.log(err);
  });
```
<a name="Spark+teamMembershipsGet"></a>

### spark.teamMembershipsGet(teamId, [max]) ⇒ <code>Promise.&lt;Array&gt;</code>
Return all Spark Team Memberships for a specific Team.

**Kind**: instance method of <code>[Spark](#Spark)</code>  
**Returns**: <code>Promise.&lt;Array&gt;</code> - Promise fulfilled with array of Membership objects.  

| Param | Type | Description |
| --- | --- | --- |
| teamId | <code>String</code> | Spark Team ID. |
| [max] | <code>Integer</code> | Number of records to return. |

**Example**  
```js
spark.teamMembershipsGet('Tm90aGluZyB0byBzZWUgaGVyZS4uLiBNb3ZlIGFsb25nLi4u', 100)
  .then(function(memberships) {
    // process memberships as array
    memberships.forEach(function(membership) {
      console.log(membership.personEmail);
    });
  })
  .catch(function(err) {
    // process error
    console.log(err);
  });
```
<a name="Spark+teamMembershipGet"></a>

### spark.teamMembershipGet(membershipId) ⇒ <code>Promise.&lt;Membership&gt;</code>
Return Spark Team Membership by ID.

**Kind**: instance method of <code>[Spark](#Spark)</code>  
**Returns**: <code>Promise.&lt;Membership&gt;</code> - Promise fulfilled Membership object.  

| Param | Type | Description |
| --- | --- | --- |
| membershipId | <code>String</code> | Spark Membership ID. |

**Example**  
```js
spark.membershipGet('Tm90aGluZyB0byBzZWUgaGVyZS4uLiBNb3ZlIGFsb25nLi4u')
  .then(function(membership) {
    console.log(membership.personEmail);
  })
  .catch(function(err){
    console.log(err);
  });
```
<a name="Spark+teamMembershipAdd"></a>

### spark.teamMembershipAdd(teamId, email, moderator) ⇒ <code>Promise.&lt;Membership&gt;</code>
Add new Spark Team Membership.

**Kind**: instance method of <code>[Spark](#Spark)</code>  
**Returns**: <code>Promise.&lt;Membership&gt;</code> - Promise fulfilled with Membership object.  

| Param | Type | Description |
| --- | --- | --- |
| teamId | <code>String</code> | Spark Team ID. |
| email | <code>String</code> | Email address of person to add. |
| moderator | <code>Boolean</code> | Boolean value to add as moderator. |

**Example**  
```js
spark.teamMembershipAdd('Tm90aGluZyB0byBzZWUgaGVyZS4uLiBNb3ZlIGFsb25nLi4u', 'aperson@company.com')
  .then(function(membership) {
    console.log(membership.id);
  })
  .catch(function(err){
    console.log(err);
  });
```
<a name="Spark+teamMembershipSetModerator"></a>

### spark.teamMembershipSetModerator(membershipId) ⇒ <code>Promise.&lt;Membership&gt;</code>
Set a Team Membership as moderator.

**Kind**: instance method of <code>[Spark](#Spark)</code>  
**Returns**: <code>Promise.&lt;Membership&gt;</code> - Promise fulfilled with Membership object.  

| Param | Type | Description |
| --- | --- | --- |
| membershipId | <code>String</code> | Spark Membership ID. |

**Example**  
```js
spark.teamMembershipSetModerator('Tm90aGluZyB0byBzZWUgaGVyZS4uLiBNb3ZlIGFsb25nLi4u')
  .then(function(membership) {
    console.log('%s is a moderator: %s', membership.personEmail, membership.isModerator);
  })
  .catch(function(err){
    console.log(err);
  });
```
<a name="Spark+teamMembershipClearModerator"></a>

### spark.teamMembershipClearModerator(membershipId) ⇒ <code>Promise.&lt;Membership&gt;</code>
Remove a Team Membership as moderator.

**Kind**: instance method of <code>[Spark](#Spark)</code>  
**Returns**: <code>Promise.&lt;Membership&gt;</code> - Promise fulfilled with Membership object.  

| Param | Type | Description |
| --- | --- | --- |
| membershipId | <code>String</code> | Spark Membership ID. |

**Example**  
```js
spark.teamMembershipClearModerator('Tm90aGluZyB0byBzZWUgaGVyZS4uLiBNb3ZlIGFsb25nLi4u')
  .then(function(membership) {
    console.log('%s is a moderator: %s', membership.personEmail, membership.isModerator);
  })
  .catch(function(err){
    console.log(err);
  });
```
<a name="Spark+teamMembershipRemove"></a>

### spark.teamMembershipRemove(membershipId) ⇒ <code>Promise</code>
Remove Spark Team Membership by ID.

**Kind**: instance method of <code>[Spark](#Spark)</code>  
**Returns**: <code>Promise</code> - Promise fulfilled on delete.  

| Param | Type | Description |
| --- | --- | --- |
| membershipId | <code>String</code> | Spark Membership ID. |

**Example**  
```js
spark.teamMembershipRemove('Tm90aGluZyB0byBzZWUgaGVyZS4uLiBNb3ZlIGFsb25nLi4u')
  .then(function() {
    console.log('Membership removed');
  })
  .catch(function(err){
    console.log(err);
  });
```
<a name="Spark+membershipsGet"></a>

### spark.membershipsGet([max]) ⇒ <code>Promise.&lt;Array&gt;</code>
Return all Spark Memberships registered to account.

**Kind**: instance method of <code>[Spark](#Spark)</code>  
**Returns**: <code>Promise.&lt;Array&gt;</code> - Promise fulfilled with array of Membership objects.  

| Param | Type | Description |
| --- | --- | --- |
| [max] | <code>Integer</code> | Number of records to return. |

**Example**  
```js
spark.membershipsGet(100)
  .then(function(memberships) {
    // process memberships as array
    memberships.forEach(function(membership) {
      console.log(membership.personEmail);
    });
  })
  .catch(function(err) {
    // process error
    console.log(err);
  });
```
<a name="Spark+membershipsByRoom"></a>

### spark.membershipsByRoom(roomId, [max]) ⇒ <code>Promise.&lt;Array&gt;</code>
Return all Spark Memberships in a Spark Room.

**Kind**: instance method of <code>[Spark](#Spark)</code>  
**Returns**: <code>Promise.&lt;Array&gt;</code> - Promise fulfilled with array of Membership objects.  

| Param | Type | Description |
| --- | --- | --- |
| roomId | <code>String</code> | Spark Room ID. |
| [max] | <code>Integer</code> | Number of records to return. |

**Example**  
```js
spark.membershipsByRoom('Tm90aGluZyB0byBzZWUgaGVyZS4uLiBNb3ZlIGFsb25nLi4u', 100)
  .then(function(memberships) {
    // process memberships as array
    memberships.forEach(function(membership) {
      console.log(membership.personEmail);
    });
  })
  .catch(function(err) {
    // process error
    console.log(err);
  });
```
<a name="Spark+membershipGet"></a>

### spark.membershipGet(membershipId) ⇒ <code>Promise.&lt;Membership&gt;</code>
Return Spark Membership by ID.

**Kind**: instance method of <code>[Spark](#Spark)</code>  
**Returns**: <code>Promise.&lt;Membership&gt;</code> - Promise fulfilled Membership object.  

| Param | Type | Description |
| --- | --- | --- |
| membershipId | <code>String</code> | Spark Membership ID. |

**Example**  
```js
spark.membershipGet('Tm90aGluZyB0byBzZWUgaGVyZS4uLiBNb3ZlIGFsb25nLi4u')
  .then(function(membership) {
    console.log(membership.personEmail);
  })
  .catch(function(err){
    console.log(err);
  });
```
<a name="Spark+membershipByRoomByEmail"></a>

### spark.membershipByRoomByEmail(roomId, personEmail) ⇒ <code>Promise.&lt;Membership&gt;</code>
Return Spark Membership by Room and Email.

**Kind**: instance method of <code>[Spark](#Spark)</code>  
**Returns**: <code>Promise.&lt;Membership&gt;</code> - Promise fulfilled with Membership object.  

| Param | Type | Description |
| --- | --- | --- |
| roomId | <code>String</code> | Spark Membership ID. |
| personEmail | <code>String</code> | Email of Person. |

**Example**  
```js
spark.membershipByRoomByEmail('Tm90aGluZyB0byBzZWUgaGVyZS4uLiBNb3ZlIGFsb25nLi4u', 'aperson@company.com')
  .then(function(membership) {
    console.log(membership.id);
  })
  .catch(function(err){
    console.log(err);
  });
```
<a name="Spark+membershipAdd"></a>

### spark.membershipAdd(roomId, email, moderator) ⇒ <code>Promise.&lt;Membership&gt;</code>
Add new Spark Membership.

**Kind**: instance method of <code>[Spark](#Spark)</code>  
**Returns**: <code>Promise.&lt;Membership&gt;</code> - Promise fulfilled with Membership object.  

| Param | Type | Description |
| --- | --- | --- |
| roomId | <code>String</code> | Spark Room ID. |
| email | <code>String</code> | Email address of person to add. |
| moderator | <code>Boolean</code> | Boolean value to add as moderator. |

**Example**  
```js
spark.membershipAdd('Tm90aGluZyB0byBzZWUgaGVyZS4uLiBNb3ZlIGFsb25nLi4u', 'aperson@company.com')
  .then(function(membership) {
    console.log(membership.id);
  })
  .catch(function(err){
    console.log(err);
  });
```
<a name="Spark+membershipSetModerator"></a>

### spark.membershipSetModerator(membershipId) ⇒ <code>Promise.&lt;Membership&gt;</code>
Set a Membership as moderator.

**Kind**: instance method of <code>[Spark](#Spark)</code>  
**Returns**: <code>Promise.&lt;Membership&gt;</code> - Promise fulfilled with Membership object.  

| Param | Type | Description |
| --- | --- | --- |
| membershipId | <code>String</code> | Spark Membership ID. |

**Example**  
```js
spark.membershipSetModerator('Tm90aGluZyB0byBzZWUgaGVyZS4uLiBNb3ZlIGFsb25nLi4u')
  .then(function(membership) {
    console.log('%s is a moderator: %s', membership.personEmail, membership.isModerator);
  })
  .catch(function(err){
    console.log(err);
  });
```
<a name="Spark+membershipClearModerator"></a>

### spark.membershipClearModerator(membershipId) ⇒ <code>Promise.&lt;Membership&gt;</code>
Remove a Membership as moderator.

**Kind**: instance method of <code>[Spark](#Spark)</code>  
**Returns**: <code>Promise.&lt;Membership&gt;</code> - Promise fulfilled with Membership object.  

| Param | Type | Description |
| --- | --- | --- |
| membershipId | <code>String</code> | Spark Membership ID. |

**Example**  
```js
spark.membershipClearModerator('Tm90aGluZyB0byBzZWUgaGVyZS4uLiBNb3ZlIGFsb25nLi4u')
  .then(function(membership) {
    console.log('%s is a moderator: %s', membership.personEmail, membership.isModerator);
  })
  .catch(function(err){
    console.log(err);
  });
```
<a name="Spark+membershipRemove"></a>

### spark.membershipRemove(membershipId) ⇒ <code>Promise</code>
Remove Spark Membership by ID.

**Kind**: instance method of <code>[Spark](#Spark)</code>  
**Returns**: <code>Promise</code> - Promise fulfilled on delete.  

| Param | Type | Description |
| --- | --- | --- |
| membershipId | <code>String</code> | Spark Membership ID. |

**Example**  
```js
spark.membershipRemove('Tm90aGluZyB0byBzZWUgaGVyZS4uLiBNb3ZlIGFsb25nLi4u')
  .then(function() {
    console.log('Membership removed');
  })
  .catch(function(err){
    console.log(err);
  });
```
<a name="Spark+webhooksGet"></a>

### spark.webhooksGet([max]) ⇒ <code>Promise.&lt;Array&gt;</code>
Return all Spark Webhooks registered to account.

**Kind**: instance method of <code>[Spark](#Spark)</code>  
**Returns**: <code>Promise.&lt;Array&gt;</code> - Promise fulfills with array of Webhook objects.  

| Param | Type | Description |
| --- | --- | --- |
| [max] | <code>Integer</code> | Number of records to return. |

**Example**  
```js
spark.webhooksGet(100)
  .then(function(webhooks) {
    // process webhooks as array
    webhooks.forEach(function(webhook) {
      console.log(webhook.name);
    });
  })
  .catch(function(err) {
    // process error
    console.log(err);
  });
```
<a name="Spark+webhookGet"></a>

### spark.webhookGet(webhookId) ⇒ <code>Promise.&lt;Webhook&gt;</code>
Return details of Spark Webhook by ID.

**Kind**: instance method of <code>[Spark](#Spark)</code>  
**Returns**: <code>Promise.&lt;Webhook&gt;</code> - Promise fulfills with Webhook object.  

| Param | Type | Description |
| --- | --- | --- |
| webhookId | <code>String</code> | Spark Webhook ID. |

**Example**  
```js
spark.webhookGet('Tm90aGluZyB0byBzZWUgaGVyZS4uLiBNb3ZlIGFsb25nLi4u')
  .then(function(webhook) {
    console.log(webhook.name);
  })
  .catch(function(err) {
    // process error
    console.log(err);
  });
```
<a name="Spark+webhookAdd"></a>

### spark.webhookAdd(resource, event, [name], roomId) ⇒ <code>Promise.&lt;Webhook&gt;</code>
Add new Spark Webhook.

**Kind**: instance method of <code>[Spark](#Spark)</code>  
**Returns**: <code>Promise.&lt;Webhook&gt;</code> - Promise fulfilled with Webhook object.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| resource | <code>String</code> |  | Resource for webhook. |
| event | <code>String</code> |  | Event for webhook. |
| [name] | <code>String</code> | <code>&#x27;mywebhook&#x27;</code> | Name assigned to webhook to add. |
| roomId | <code>String</code> |  | (required only if resource !== 'all') Spark Room ID. |

**Example**  
```js
spark.webhookAdd('messages', 'created', 'mywebhook', 'Tm90aGluZyB0byBzZWUgaGVyZS4uLiBNb3ZlIGFsb25nLi4u')
  .then(function(webhook) {
    console.log(webhook.name);
  })
  .catch(function(err) {
    // process error
    console.log(err);
  });
```
<a name="Spark+webhookRemove"></a>

### spark.webhookRemove(webhookId) ⇒ <code>Promise</code>
Remove Spark Webhook by ID.

**Kind**: instance method of <code>[Spark](#Spark)</code>  
**Returns**: <code>Promise</code> - Promise fulfilled on delete.  

| Param | Type | Description |
| --- | --- | --- |
| webhookId | <code>String</code> | Spark Webhook ID. |

**Example**  
```js
spark.webhookRemove('Tm90aGluZyB0byBzZWUgaGVyZS4uLiBNb3ZlIGFsb25nLi4u')
  .then(function() {
    console.log('Webhook removed');
  })
  .catch(function(err){
    console.log(err);
  });
```
<a name="Spark.options"></a>

### Spark.options : <code>object</code>
Options Object

**Kind**: static namespace of <code>[Spark](#Spark)</code>  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| token | <code>string</code> | Spark Token. |
| webhookUrl | <code>string</code> | URL that is used for SPark API to send callbacks. |
| maxPageItems | <code>string</code> | Max results that the paginator uses. |
| maxConcurrent | <code>string</code> | Max concurrent sessions to the Spark API |
| minTime | <code>string</code> | Min time between consecutive request starts. |
| requeueMinTime | <code>string</code> | Min time between consecutive request starts of requests that have been re-queued. |
| requeueMaxRetry | <code>string</code> | Msx number of atteempts to make for failed request. |
| requeueCodes | <code>string</code> | Array of http result codes that should be retried. |
| requestTimeout | <code>string</code> | Timeout for an individual request recieving a response. |
| queueSize | <code>string</code> | Size of the buffer that holds outbound requests. |
| requeueSize | <code>string</code> | Size of the buffer that holds outbound re-queue requests. |

<a name="Person"></a>

## Person : <code>object</code>
Person Object

**Kind**: global namespace  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| id | <code>string</code> | Person ID |
| emails | <code>array</code> | Emails |
| displayName | <code>string</code> | Display Name |
| avatar | <code>string</code> | Avatar URL |
| created | <code>date</code> | Date created |
| email | <code>string</code> | Email |
| username | <code>string</code> | Username |
| domain | <code>string</code> | Domain name |

<a name="Message"></a>

## Message : <code>object</code>
Message Object

**Kind**: global namespace  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| id | <code>string</code> | Message ID |
| personId | <code>string</code> | Person ID |
| personEmail | <code>string</code> | Person Email |
| roomId | <code>string</code> | Room ID |
| text | <code>string</code> | Message text |
| files | <code>array</code> | Array of File objects |
| created | <code>date</code> | Date Message created |

<a name="File"></a>

## File : <code>object</code>
File Object

**Kind**: global namespace  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| id | <code>string</code> | Spark API Content ID |
| name | <code>string</code> | File name |
| ext | <code>string</code> | File extension |
| type | <code>string</code> | Header [content-type] for file |
| binary | <code>buffer</code> | File contents as binary |
| base64 | <code>string</code> | File contents as base64 encoded string |

<a name="Validator"></a>

## Validator : <code>object</code>
Spark Validation.

**Kind**: global namespace  

* [Validator](#Validator) : <code>object</code>
    * [.isEmail()](#Validator.isEmail) ⇒ <code>Boolean</code>
    * [.isUrl()](#Validator.isUrl) ⇒ <code>Boolean</code>
    * [.isRoom(object)](#Validator.isRoom) ⇒ <code>Boolean</code>
    * [.isPerson(object)](#Validator.isPerson) ⇒ <code>Boolean</code>
    * [.isMessage(object)](#Validator.isMessage) ⇒ <code>Boolean</code>
    * [.isMembership(object)](#Validator.isMembership) ⇒ <code>Boolean</code>
    * [.isWebhook(object)](#Validator.isWebhook) ⇒ <code>Boolean</code>
    * [.isRooms(rooms)](#Validator.isRooms) ⇒ <code>Boolean</code>
    * [.isPeople(persons)](#Validator.isPeople) ⇒ <code>Boolean</code>
    * [.isMessages(messages)](#Validator.isMessages) ⇒ <code>Boolean</code>
    * [.isMemberships(memberships)](#Validator.isMemberships) ⇒ <code>Boolean</code>
    * [.isWebhooks(webhooks)](#Validator.isWebhooks) ⇒ <code>Boolean</code>
    * [.isTeam(object)](#Validator.isTeam) ⇒ <code>Boolean</code>

<a name="Validator.isEmail"></a>

### Validator.isEmail() ⇒ <code>Boolean</code>
Validate String is Email.

**Kind**: static method of <code>[Validator](#Validator)</code>  
**Returns**: <code>Boolean</code> - Returns results of validation..  
<a name="Validator.isUrl"></a>

### Validator.isUrl() ⇒ <code>Boolean</code>
Validate String is URL.

**Kind**: static method of <code>[Validator](#Validator)</code>  
**Returns**: <code>Boolean</code> - Returns results of validation..  
<a name="Validator.isRoom"></a>

### Validator.isRoom(object) ⇒ <code>Boolean</code>
Validate Spark Room Object.

**Kind**: static method of <code>[Validator](#Validator)</code>  
**Returns**: <code>Boolean</code> - True/false result of validation.  

| Param | Type |
| --- | --- |
| object | <code>Room</code> | 

<a name="Validator.isPerson"></a>

### Validator.isPerson(object) ⇒ <code>Boolean</code>
Validate Spark Room Object.

**Kind**: static method of <code>[Validator](#Validator)</code>  
**Returns**: <code>Boolean</code> - True/false result of validation.  

| Param | Type |
| --- | --- |
| object | <code>Room</code> | 

<a name="Validator.isMessage"></a>

### Validator.isMessage(object) ⇒ <code>Boolean</code>
Validate Spark Message Object.

**Kind**: static method of <code>[Validator](#Validator)</code>  
**Returns**: <code>Boolean</code> - True/false result of validation.  

| Param | Type |
| --- | --- |
| object | <code>[Message](#Message)</code> | 

<a name="Validator.isMembership"></a>

### Validator.isMembership(object) ⇒ <code>Boolean</code>
Validate Spark Membership Object.

**Kind**: static method of <code>[Validator](#Validator)</code>  
**Returns**: <code>Boolean</code> - True/false result of validation.  

| Param | Type |
| --- | --- |
| object | <code>Membership</code> | 

<a name="Validator.isWebhook"></a>

### Validator.isWebhook(object) ⇒ <code>Boolean</code>
Validate Spark Webhook Object.

**Kind**: static method of <code>[Validator](#Validator)</code>  
**Returns**: <code>Boolean</code> - True/false result of validation.  

| Param | Type |
| --- | --- |
| object | <code>Webhook</code> | 

<a name="Validator.isRooms"></a>

### Validator.isRooms(rooms) ⇒ <code>Boolean</code>
Validate Spark Room Objects in Array.

**Kind**: static method of <code>[Validator](#Validator)</code>  
**Returns**: <code>Boolean</code> - True/false result of validation.  

| Param | Type |
| --- | --- |
| rooms | <code>Array</code> | 

<a name="Validator.isPeople"></a>

### Validator.isPeople(persons) ⇒ <code>Boolean</code>
Validate Spark Person Objects in Array.

**Kind**: static method of <code>[Validator](#Validator)</code>  
**Returns**: <code>Boolean</code> - True/false result of validation.  

| Param | Type |
| --- | --- |
| persons | <code>Array</code> | 

<a name="Validator.isMessages"></a>

### Validator.isMessages(messages) ⇒ <code>Boolean</code>
Validate Spark Message Objects in Array.

**Kind**: static method of <code>[Validator](#Validator)</code>  
**Returns**: <code>Boolean</code> - True/false result of validation.  

| Param | Type |
| --- | --- |
| messages | <code>Array</code> | 

<a name="Validator.isMemberships"></a>

### Validator.isMemberships(memberships) ⇒ <code>Boolean</code>
Validate Spark Membership Objects in Array.

**Kind**: static method of <code>[Validator](#Validator)</code>  
**Returns**: <code>Boolean</code> - True/false result of validation.  

| Param | Type |
| --- | --- |
| memberships | <code>Array</code> | 

<a name="Validator.isWebhooks"></a>

### Validator.isWebhooks(webhooks) ⇒ <code>Boolean</code>
Validate Spark Webhook Objects in Array.

**Kind**: static method of <code>[Validator](#Validator)</code>  
**Returns**: <code>Boolean</code> - True/false result of validation.  

| Param | Type |
| --- | --- |
| webhooks | <code>Array</code> | 

<a name="Validator.isTeam"></a>

### Validator.isTeam(object) ⇒ <code>Boolean</code>
Validate Spark Team Object.

**Kind**: static method of <code>[Validator](#Validator)</code>  
**Returns**: <code>Boolean</code> - True/false result of validation.  

| Param | Type |
| --- | --- |
| object | <code>Team</code> | 

<a name="event_drop"></a>

## "drop"
Spark Queue Drop Event.

**Kind**: event emitted  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| request | <code>options</code> | API Request |
| id | <code>string</code> | Spark UUID |

<a name="event_request"></a>

## "request"
Spark request event.

**Kind**: event emitted  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| request | <code>options</code> | API Request |
| id | <code>string</code> | Spark UUID |

<a name="event_reponse"></a>

## "reponse"
Spark response event.

**Kind**: event emitted  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| response | <code>options</code> | Response |
| id | <code>string</code> | Spark UUID |

<a name="event_retry"></a>

## "retry"
Spark retry event.

**Kind**: event emitted  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| request | <code>options</code> | API Request |
| id | <code>string</code> | Spark UUID |

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