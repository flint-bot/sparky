<a name="Spark"></a>

## Spark
**Kind**: global class  
**Throw**: <code>Error</code> Throws on spark token missing in options object.  

* [Spark](#Spark)
    * [new Spark(options)](#new_Spark_new)
    * [.roomsGet(max)](#Spark+roomsGet) ⇒ <code>Promise.&lt;Array&gt;</code>
    * [.roomGet(roomId)](#Spark+roomGet) ⇒ <code>Promise.&lt;Room&gt;</code>
    * [.roomAdd(title)](#Spark+roomAdd) ⇒ <code>Promise.&lt;Room&gt;</code>
    * [.roomRename(roomId, title)](#Spark+roomRename) ⇒ <code>Promise.&lt;Room&gt;</code>
    * [.roomRemove(roomId)](#Spark+roomRemove) ⇒ <code>Promise</code>
    * [.peopleSearch(displayName, max)](#Spark+peopleSearch) ⇒ <code>Promise.&lt;Array&gt;</code>
    * [.personGet(personId)](#Spark+personGet) ⇒ <code>Promise.&lt;Person&gt;</code>
    * [.personMe()](#Spark+personMe) ⇒ <code>Promise.&lt;Person&gt;</code>
    * [.personByEmail(email)](#Spark+personByEmail) ⇒ <code>Promise.&lt;Person&gt;</code>
    * [.messagesGet(roomId, max)](#Spark+messagesGet) ⇒ <code>Promise.&lt;Array&gt;</code>
    * [.messageGet(Message)](#Spark+messageGet) ⇒ <code>Promise.&lt;Message&gt;</code>
    * [.messageSendPerson(email)](#Spark+messageSendPerson) ⇒ <code>Promise.&lt;Message&gt;</code>
    * [.messageSendRoom(roomId)](#Spark+messageSendRoom) ⇒ <code>Promise.&lt;Message&gt;</code>
    * [.messageRemove(messageId)](#Spark+messageRemove) ⇒ <code>Promise</code>
    * [.contentGet(id)](#Spark+contentGet) ⇒ <code>Promise.&lt;File&gt;</code>
    * [.contentByUrl(url)](#Spark+contentByUrl) ⇒ <code>Promise.&lt;File&gt;</code>
    * [.membershipsGet(max)](#Spark+membershipsGet) ⇒ <code>Promise.&lt;Array&gt;</code>
    * [.membershipsByRoom(roomId, max)](#Spark+membershipsByRoom) ⇒ <code>Promise.&lt;Array&gt;</code>
    * [.membershipGet(membershipId)](#Spark+membershipGet) ⇒ <code>Promise.&lt;Membership&gt;</code>
    * [.membershipByRoomByEmail(roomId, personEmail)](#Spark+membershipByRoomByEmail) ⇒ <code>Promise.&lt;Membership&gt;</code>
    * [.membershipAdd(roomId, email, moderator)](#Spark+membershipAdd) ⇒ <code>Promise.&lt;Membership&gt;</code>
    * [.membershipSetModerator(membershipId)](#Spark+membershipSetModerator) ⇒ <code>Promise.&lt;Membership&gt;</code>
    * [.membershipClearModerator(membershipId)](#Spark+membershipClearModerator) ⇒ <code>Promise.&lt;Membership&gt;</code>
    * [.membershipRemove(membershipId)](#Spark+membershipRemove) ⇒ <code>Promise</code>
    * [.webhooksGet(max)](#Spark+webhooksGet) ⇒ <code>Promise.&lt;Array&gt;</code>
    * [.webhookGet(webhookId)](#Spark+webhookGet) ⇒ <code>Promise.&lt;Webhook&gt;</code>
    * [.webhookAdd(resource, event, name, roomId)](#Spark+webhookAdd) ⇒ <code>Promise.&lt;Webhook&gt;</code>
    * [.webhookRemove(webhookId)](#Spark+webhookRemove) ⇒ <code>Promise</code>

<a name="new_Spark_new"></a>

### new Spark(options)
Creates a Spark API instance that is then attached to a Spark Account.


| Param | Type | Description |
| --- | --- | --- |
| options | <code>Object</code> | Configuration object containing Spark settings. |

<a name="Spark+roomsGet"></a>

### spark.roomsGet(max) ⇒ <code>Promise.&lt;Array&gt;</code>
Return all Spark Rooms registered to account.

**Kind**: instance method of <code>[Spark](#Spark)</code>  
**Returns**: <code>Promise.&lt;Array&gt;</code> - Promise fulfilled with array of Room objects.  

| Param | Type | Description |
| --- | --- | --- |
| max | <code>Integer</code> | (optional, defaults to all items) Number of records to return. |

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
spark.roomsAdd('myroom')
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
spark.roomsRename('Tm90aGluZyB0byBzZWUgaGVyZS4uLiBNb3ZlIGFsb25nLi4u', 'myroom2')
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
spark.roomsRemove('Tm90aGluZyB0byBzZWUgaGVyZS4uLiBNb3ZlIGFsb25nLi4u')
  .then(function() {
    console.log('Room removed.');
  })
  .catch(function(err) {
    // process error
    console.log(err);
  });
```
<a name="Spark+peopleSearch"></a>

### spark.peopleSearch(displayName, max) ⇒ <code>Promise.&lt;Array&gt;</code>
Search Spark for People by display name.

**Kind**: instance method of <code>[Spark](#Spark)</code>  
**Returns**: <code>Promise.&lt;Array&gt;</code> - Promise fulfilled with array of Message objects.  

| Param | Type | Description |
| --- | --- | --- |
| displayName | <code>String</code> | Search String to find as display name. |
| max | <code>Integer</code> | (optional, defaults to all items) Number of records to return. |

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

### spark.personGet(personId) ⇒ <code>Promise.&lt;Person&gt;</code>
Return details of Spark User by ID.

**Kind**: instance method of <code>[Spark](#Spark)</code>  
**Returns**: <code>Promise.&lt;Person&gt;</code> - Promise fulfilled with Person object.  

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

### spark.personMe() ⇒ <code>Promise.&lt;Person&gt;</code>
Return details of Spark User that has authenticated.

**Kind**: instance method of <code>[Spark](#Spark)</code>  
**Returns**: <code>Promise.&lt;Person&gt;</code> - Promise fulfilled with Person object.  
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

### spark.personByEmail(email) ⇒ <code>Promise.&lt;Person&gt;</code>
Return details of Spark User by Email.

**Kind**: instance method of <code>[Spark](#Spark)</code>  
**Returns**: <code>Promise.&lt;Person&gt;</code> - Promise fulfilled with Person object.  

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

### spark.messagesGet(roomId, max) ⇒ <code>Promise.&lt;Array&gt;</code>
Return messages in a Spark Room.

**Kind**: instance method of <code>[Spark](#Spark)</code>  
**Returns**: <code>Promise.&lt;Array&gt;</code> - Promise fulfilled with array of Message objects.  

| Param | Type | Description |
| --- | --- | --- |
| roomId | <code>String</code> | Spark Room ID. |
| max | <code>Integer</code> | (optional, defaults to all items) Number of records to return. |

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

### spark.messageGet(Message) ⇒ <code>Promise.&lt;Message&gt;</code>
Return details of Spark Message by ID.

**Kind**: instance method of <code>[Spark](#Spark)</code>  
**Returns**: <code>Promise.&lt;Message&gt;</code> - Promise fulfilled with Message object.  

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

### spark.messageSendPerson(email) ⇒ <code>Promise.&lt;Message&gt;</code>
Sends 1:1 Spark message to a person.

**Kind**: instance method of <code>[Spark](#Spark)</code>  
**Returns**: <code>Promise.&lt;Message&gt;</code> - Promise fulfilled with Message object.  

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

### spark.messageSendRoom(roomId) ⇒ <code>Promise.&lt;Message&gt;</code>
Sends Spark message to a room.

**Kind**: instance method of <code>[Spark](#Spark)</code>  
**Returns**: <code>Promise.&lt;Message&gt;</code> - Promise fulfilled with Message object.  

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

### spark.contentGet(id) ⇒ <code>Promise.&lt;File&gt;</code>
Return details of Spark File by Content ID.

**Kind**: instance method of <code>[Spark](#Spark)</code>  
**Returns**: <code>Promise.&lt;File&gt;</code> - Promise fulfilled with File object.  

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

### spark.contentByUrl(url) ⇒ <code>Promise.&lt;File&gt;</code>
Return details of Spark File by Spark Content URL.

**Kind**: instance method of <code>[Spark](#Spark)</code>  
**Returns**: <code>Promise.&lt;File&gt;</code> - Promise fulfilled with File object.  

| Param | Type | Description |
| --- | --- | --- |
| url | <code>String</code> | Spark Content URL. |

**Example**  
```js
spark.contentGetByUrl('http://api.ciscospark.com/v1/contents/Tm90aGluZyB0byBzZWUgaGVyZS4uLiBNb3ZlIGFsb25nLi4u')
  .then(function(file) {
    console.log('File name: %s', file.name);
  })
  .catch(function(err){
    console.log(err);
  });
```
<a name="Spark+membershipsGet"></a>

### spark.membershipsGet(max) ⇒ <code>Promise.&lt;Array&gt;</code>
Return all Spark Memberships registered to account.

**Kind**: instance method of <code>[Spark](#Spark)</code>  
**Returns**: <code>Promise.&lt;Array&gt;</code> - Promise fulfilled with array of Membership objects.  

| Param | Type | Description |
| --- | --- | --- |
| max | <code>Integer</code> | (optional, defaults to all items) Number of records to return. |

**Example**  
```js
spark.membershipsGet(100)
  .then(function(messages) {
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

### spark.membershipsByRoom(roomId, max) ⇒ <code>Promise.&lt;Array&gt;</code>
Return all Spark Memberships in a Spark Room.

**Kind**: instance method of <code>[Spark](#Spark)</code>  
**Returns**: <code>Promise.&lt;Array&gt;</code> - Promise fulfilled with array of Membership objects.  

| Param | Type | Description |
| --- | --- | --- |
| roomId | <code>String</code> | Spark Room ID. |
| max | <code>Integer</code> | (optional, defaults to all items) Number of records to return. |

**Example**  
```js
spark.membershipsByRoom('Tm90aGluZyB0byBzZWUgaGVyZS4uLiBNb3ZlIGFsb25nLi4u', 100)
  .then(function(messages) {
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
spark.membershipGet('Tm90aGluZyB0byBzZWUgaGVyZS4uLiBNb3ZlIGFsb25nLi4u', 'aperson@company.com')
  .then(function(membership) {
    console.log('%s is a moderator: %s', membership.personEmail, membership.isModerator);
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
spark.membershipGet('Tm90aGluZyB0byBzZWUgaGVyZS4uLiBNb3ZlIGFsb25nLi4u', 'aperson@company.com')
  .then(function(membership) {
    console.log('%s is a moderator: %s', membership.personEmail, membership.isModerator);
  })
  .catch(function(err){
    console.log(err);
  });
```
<a name="Spark+membershipSetModerator"></a>

### spark.membershipSetModerator(membershipId) ⇒ <code>Promise.&lt;Membership&gt;</code>
Set a membership as moderator.

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
Remove a membership as moderator.

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

### spark.webhooksGet(max) ⇒ <code>Promise.&lt;Array&gt;</code>
Return all Spark Webhooks registered to account.

**Kind**: instance method of <code>[Spark](#Spark)</code>  
**Returns**: <code>Promise.&lt;Array&gt;</code> - Promise fulfills with array of Webhook objects.  

| Param | Type | Description |
| --- | --- | --- |
| max | <code>Integer</code> | (optional, defaults to all items) Number of records to return. |

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

### spark.webhookAdd(resource, event, name, roomId) ⇒ <code>Promise.&lt;Webhook&gt;</code>
Add new Spark Webhook.

**Kind**: instance method of <code>[Spark](#Spark)</code>  
**Returns**: <code>Promise.&lt;Webhook&gt;</code> - Promise fulfilled with Webhook object.  

| Param | Type | Description |
| --- | --- | --- |
| resource | <code>String</code> | Resource for webhook. |
| event | <code>String</code> | Event for webhook. |
| name | <code>String</code> | (optional, defaults to 'mywebhook') Name assigned to webhook to add. |
| roomId | <code>String</code> | (required only if resource !== 'all') Spark Room ID. |

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
