# node-sparky

[![NPM](https://nodei.co/npm/node-sparky.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/node-sparky/)

#### Cisco Spark SDK for Node JS (Version 4)

```js
var Spark = require('node-sparky');

var spark = new Spark({token: '<my token>'});

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

## Features

* [Rate limiting headers](https://developer.ciscospark.com/blog/blog-details-8193.html) inspected to adjust request rates based on Cisco Spark API. These are automatically re-queued and sent after the `retry-after` timer expires.
* File processor for retrieving attachments from room.
* Returns promises that comply with [A+ standards.](https://promisesaplus.com/).
* Handles pagination transparently. (Receive unlimited records)
* Support for [authenticated HMAC-SHA1 webhooks](https://developer.ciscospark.com/webhooks-explained.html#sensitive-data)

_**Note: If you are coming from using node-sparky version 3.x or earlier, note
that the architecture, commands, and some variable names have changed. While this
release is similar to previous versions, there are some major differences.
Please read the API docs below and review the [CHANGELOG.md](CHANGELOG.md)
before migrating your code to this release. If you are looking for the old
release version, node-sparky@2.0.27 and node-sparky@3.1.19 is still available to
be installed through NPM.**_


## Using `node-sparky` as a Node JS Package

This module can be installed via NPM:

```bash
npm install node-sparky --save
```

## Using `node-sparky` in the Browser

You can use node-sparky on the client side browser as well. Simply include
`<script src="browser/node-sparky.js"></script>` in your page and you can use
node-sparky just as you can with with node-js.

```html
<head>
    <title>test</title>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/1.12.4/jquery.min.js"></script>
    <script src="browser/node-sparky.js"></script>
</head>

<body>
    <h1>Test</h1>
    <div id="messageId"></div>

    <script>
        $(document).ready(function() {
            var spark = new Sparky({
                token: '<my token>'
            });

            var message = {
                roomId: '<room id>',
                text: 'Hello world!'
            };

            spark.messageAdd(message)
                .then(function(res) {
                    $('#messageId').html(res.id);
                })
                .catch(function(err) {
                    console.log(err);
                });
        });
    </script>
</body>

</html>
```


## Tests

Tests can be run via:

```bash
git clone https://github.com/flint-bot/sparky
cd sparky
npm install
TOKEN=someTokenHere npm test
```

Additional tests will run if the following environment variables are defined:

* `TEAM_ID`
* `ORG_ID`

_**Note: Tests that are marked "pending" are those that are missing their
corresponding environmental variable.**_

# Reference
## Classes

<dl>
<dt><a href="#Spark">Spark</a></dt>
<dd></dd>
</dl>

## Objects

<dl>
<dt><a href="#File">File</a> : <code>object</code></dt>
<dd><p>File Object</p>
</dd>
<dt><a href="#License">License</a> : <code>object</code></dt>
<dd><p>License Object</p>
</dd>
<dt><a href="#Membership">Membership</a> : <code>object</code></dt>
<dd><p>Membership Object</p>
</dd>
<dt><a href="#MembershipSearch">MembershipSearch</a> : <code>object</code></dt>
<dd><p>Membership Search Object</p>
</dd>
<dt><a href="#Message">Message</a> : <code>object</code></dt>
<dd><p>Message Object</p>
</dd>
<dt><a href="#MessageSearch">MessageSearch</a> : <code>object</code></dt>
<dd><p>Message Search Object</p>
</dd>
<dt><a href="#MessageAdd">MessageAdd</a> : <code>object</code></dt>
<dd><p>Message Add Object</p>
</dd>
<dt><a href="#Organization">Organization</a> : <code>object</code></dt>
<dd><p>Organization Object</p>
</dd>
<dt><a href="#Person">Person</a> : <code>object</code></dt>
<dd><p>Person Object</p>
</dd>
<dt><a href="#PersonSearch">PersonSearch</a> : <code>object</code></dt>
<dd><p>Person Search Object</p>
</dd>
<dt><a href="#Role">Role</a> : <code>object</code></dt>
<dd><p>Role Object</p>
</dd>
<dt><a href="#Room">Room</a> : <code>object</code></dt>
<dd><p>Room Object</p>
</dd>
<dt><a href="#RoomSearch">RoomSearch</a> : <code>object</code></dt>
<dd><p>Room Search Object</p>
</dd>
<dt><a href="#Team">Team</a> : <code>object</code></dt>
<dd><p>Team Object</p>
</dd>
<dt><a href="#TeamMembership">TeamMembership</a> : <code>object</code></dt>
<dd><p>Team Membership Object</p>
</dd>
<dt><a href="#Webhook">Webhook</a> : <code>object</code></dt>
<dd><p>Webhook Object</p>
</dd>
<dt><a href="#Validator">Validator</a> : <code>object</code></dt>
<dd><p>Spark Object Validation</p>
</dd>
</dl>

## Events

<dl>
<dt><a href="#event_memberships">"memberships"</a></dt>
<dd><p>Webhook membership event</p>
</dd>
<dt><a href="#event_messages">"messages"</a></dt>
<dd><p>Webhook messages event</p>
</dd>
<dt><a href="#event_rooms">"rooms"</a></dt>
<dd><p>Webhook rooms event</p>
</dd>
<dt><a href="#event_request">"request"</a></dt>
<dd><p>Webhook request event</p>
</dd>
</dl>

<a name="Spark"></a>

## Spark
**Kind**: global class  

* [Spark](#Spark)
    * [new Spark(options)](#new_Spark_new)
    * [.contentGet(contentId)](#Spark.contentGet) ⇒ <code>[Promise.&lt;File&gt;](#File)</code>
    * [.contentCreate(filePath, [timeout])](#Spark.contentCreate) ⇒ <code>[Promise.&lt;File&gt;](#File)</code>
    * [.licensesGet([orgId], [max])](#Spark.licensesGet) ⇒ <code>[Promise.Array.&lt;License&gt;](#License)</code>
    * [.licenseGet(licenseId)](#Spark.licenseGet) ⇒ <code>[Promise.&lt;License&gt;](#License)</code>
    * [.membershipsGet([membershipSearch], [max])](#Spark.membershipsGet) ⇒ <code>[Promise.Array.&lt;Membership&gt;](#Membership)</code>
    * [.membershipGet(membershipId)](#Spark.membershipGet) ⇒ <code>[Promise.&lt;Membership&gt;](#Membership)</code>
    * [.membershipAdd(roomId, personEmail, [isModerator])](#Spark.membershipAdd) ⇒ <code>[Promise.&lt;Membership&gt;](#Membership)</code>
    * [.membershipUpdate(membership)](#Spark.membershipUpdate) ⇒ <code>[Promise.&lt;Membership&gt;](#Membership)</code>
    * [.membershipRemove(membershipId)](#Spark.membershipRemove) ⇒ <code>Promise</code>
    * [.messagesGet(messageSearch, [max])](#Spark.messagesGet) ⇒ <code>[Promise.Array.&lt;Message&gt;](#Message)</code>
    * [.messageGet(messageId)](#Spark.messageGet) ⇒ <code>[Promise.&lt;Message&gt;](#Message)</code>
    * [.messageAdd(message, [file])](#Spark.messageAdd) ⇒ <code>[Promise.&lt;Message&gt;](#Message)</code>
    * [.messageRemove(messageId)](#Spark.messageRemove) ⇒ <code>Promise</code>
    * [.organizationsGet([max])](#Spark.organizationsGet) ⇒ <code>[Promise.Array.&lt;Organization&gt;](#Organization)</code>
    * [.organizationGet(orgId)](#Spark.organizationGet) ⇒ <code>[Promise.&lt;Organization&gt;](#Organization)</code>
    * [.peopleGet([personSearch], [max])](#Spark.peopleGet) ⇒ <code>[Promise.Array.&lt;Person&gt;](#Person)</code>
    * [.personGet(personId)](#Spark.personGet) ⇒ <code>[Promise.&lt;Person&gt;](#Person)</code>
    * [.personMe()](#Spark.personMe) ⇒ <code>[Promise.&lt;Person&gt;](#Person)</code>
    * [.personAdd(person)](#Spark.personAdd) ⇒ <code>[Promise.&lt;Person&gt;](#Person)</code>
    * [.personUpdate(person)](#Spark.personUpdate) ⇒ <code>[Promise.&lt;Person&gt;](#Person)</code>
    * [.personRemove(personId)](#Spark.personRemove) ⇒ <code>Promise</code>
    * [.rolesGet([max])](#Spark.rolesGet) ⇒ <code>[Promise.Array.&lt;Role&gt;](#Role)</code>
    * [.roleGet(roleId)](#Spark.roleGet) ⇒ <code>[Promise.&lt;Role&gt;](#Role)</code>
    * [.roomsGet([roomSearch], [max])](#Spark.roomsGet) ⇒ <code>[Promise.Array.&lt;Room&gt;](#Room)</code>
    * [.roomGet(roomId)](#Spark.roomGet) ⇒ <code>[Promise.&lt;Room&gt;](#Room)</code>
    * [.roomAdd(title, [teamId])](#Spark.roomAdd) ⇒ <code>[Promise.&lt;Room&gt;](#Room)</code>
    * [.roomUpdate(room)](#Spark.roomUpdate) ⇒ <code>[Promise.&lt;Room&gt;](#Room)</code>
    * [.roomRemove(roomId)](#Spark.roomRemove) ⇒ <code>Promise</code>
    * [.teamsGet([max])](#Spark.teamsGet) ⇒ <code>[Promise.Array.&lt;Team&gt;](#Team)</code>
    * [.teamGet(teamId)](#Spark.teamGet) ⇒ <code>[Promise.&lt;Team&gt;](#Team)</code>
    * [.teamAdd(name)](#Spark.teamAdd) ⇒ <code>[Promise.&lt;Team&gt;](#Team)</code>
    * [.teamUpdate(team)](#Spark.teamUpdate) ⇒ <code>[Promise.&lt;Team&gt;](#Team)</code>
    * [.teamRemove(teamId)](#Spark.teamRemove) ⇒ <code>Promise</code>
    * [.teamMembershipsGet(teamId, [max])](#Spark.teamMembershipsGet) ⇒ <code>[Promise.Array.&lt;TeamMembership&gt;](#TeamMembership)</code>
    * [.teamMembershipGet(membershipId)](#Spark.teamMembershipGet) ⇒ <code>[Promise.&lt;TeamMembership&gt;](#TeamMembership)</code>
    * [.teamMembershipAdd(teamId, personEmail, isModerator)](#Spark.teamMembershipAdd) ⇒ <code>[Promise.&lt;TeamMembership&gt;](#TeamMembership)</code>
    * [.teamMembershipUpdate(teamMembership)](#Spark.teamMembershipUpdate) ⇒ <code>[Promise.&lt;TeamMembership&gt;](#TeamMembership)</code>
    * [.teamMembershipRemove(membershipId)](#Spark.teamMembershipRemove) ⇒ <code>Promise</code>
    * [.webhooksGet([max])](#Spark.webhooksGet) ⇒ <code>[Promise.Array.&lt;Webhook&gt;](#Webhook)</code>
    * [.webhookGet(webhookId)](#Spark.webhookGet) ⇒ <code>[Promise.&lt;Webhook&gt;](#Webhook)</code>
    * [.webhookAdd(webhook)](#Spark.webhookAdd) ⇒ <code>[Promise.&lt;Webhook&gt;](#Webhook)</code>
    * [.webhookUpdate(webhook)](#Spark.webhookUpdate) ⇒ <code>[Promise.&lt;Webhook&gt;](#Webhook)</code>
    * [.webhookRemove(webhookId)](#Spark.webhookRemove) ⇒ <code>Promise</code>
    * [.webhookAuth(secret, signature, payload)](#Spark.webhookAuth) ⇒ <code>Promise.String</code> &#124; <code>Object</code>
    * [.webhookListen()](#Spark.webhookListen) ⇒ <code>[webhookHandler](#Spark.webhookListen..webhookHandler)</code>
        * [~webhookHandler(req, [res], [next])](#Spark.webhookListen..webhookHandler)

<a name="new_Spark_new"></a>

### new Spark(options)
Creates a Spark API instance that is then attached to a Spark Account.


| Param | Type | Description |
| --- | --- | --- |
| options | <code>Object</code> | Sparky options object |

<a name="Spark.contentGet"></a>

### Spark.contentGet(contentId) ⇒ <code>[Promise.&lt;File&gt;](#File)</code>
Returns a File Object specified by Content ID or Content URL.

**Kind**: static method of <code>[Spark](#Spark)</code>  
**Returns**: <code>[Promise.&lt;File&gt;](#File)</code> - File  

| Param | Type | Description |
| --- | --- | --- |
| contentId | <code>String</code> | Spark Content ID or URL |

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
<a name="Spark.contentCreate"></a>

### Spark.contentCreate(filePath, [timeout]) ⇒ <code>[Promise.&lt;File&gt;](#File)</code>
Create File Object from local file path.

**Kind**: static method of <code>[Spark](#Spark)</code>  
**Returns**: <code>[Promise.&lt;File&gt;](#File)</code> - File  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| filePath | <code>String</code> |  | Path to file |
| [timeout] | <code>Integer</code> | <code>15000</code> | Timeout in ms to read file (optional) |

**Example**  
```js
spark.contentCreate('/some/local/file.png')
  .then(function(file) {
    console.log(file.name);
  })
  .catch(function(err) {
    console.log(err);
  });
```
<a name="Spark.licensesGet"></a>

### Spark.licensesGet([orgId], [max]) ⇒ <code>[Promise.Array.&lt;License&gt;](#License)</code>
Returns all Spark Licenses for a given Organization ID. If no organization ID argument is passed, licenses are returned for the Organization that the authenticated account is in. If 'max' is not specifed, returns all.

**Kind**: static method of <code>[Spark](#Spark)</code>  
**Returns**: <code>[Promise.Array.&lt;License&gt;](#License)</code> - Licenses Collection  

| Param | Type | Description |
| --- | --- | --- |
| [orgId] | <code>String</code> | The organization ID to query (optional) |
| [max] | <code>Integer</code> | Number of records to return (optional) |

**Example**  
```js
spark.licensesGet('Tm90aGluZyB0byBzZWUgaGVyZS4uLiBNb3ZlIGFsb25nLi4u', 10)
  .then(function(licenses) {
    // process licenses as array
    licenses.forEach(function(license) {
      console.log(license.name);
    });
  })
  .catch(function(err) {
    // process error
    console.log(err);
  });
```
<a name="Spark.licenseGet"></a>

### Spark.licenseGet(licenseId) ⇒ <code>[Promise.&lt;License&gt;](#License)</code>
Returns a Spark License specified by License ID.

**Kind**: static method of <code>[Spark](#Spark)</code>  
**Returns**: <code>[Promise.&lt;License&gt;](#License)</code> - License  

| Param | Type | Description |
| --- | --- | --- |
| licenseId | <code>String</code> | Spark License ID |

**Example**  
```js
spark.licenseGet('Tm90aGluZyB0byBzZWUgaGVyZS4uLiBNb3ZlIGFsb25nLi4u')
  .then(function(license) {
    console.log(license.name);
  })
  .catch(function(err) {
    // process error
    console.log(err);
  });
```
<a name="Spark.membershipsGet"></a>

### Spark.membershipsGet([membershipSearch], [max]) ⇒ <code>[Promise.Array.&lt;Membership&gt;](#Membership)</code>
Returns all Spark Memberships that the authenticated account is in. If 'max' is not specifed, returns all.

**Kind**: static method of <code>[Spark](#Spark)</code>  
**Returns**: <code>[Promise.Array.&lt;Membership&gt;](#Membership)</code> - Memberships Collection  

| Param | Type | Description |
| --- | --- | --- |
| [membershipSearch] | <code>[Object.&lt;MembershipSearch&gt;](#MembershipSearch)</code> | Spark Membership Search Object (optional) |
| [max] | <code>Integer</code> | Number of records to return |

**Example**  
```js
spark.membershipsGet({ roomId: 'Tm90aGluZyB0byBzZWUgaGVyZS4uLiBNb3ZlIGFsb25nLi4u' }, 10)
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
<a name="Spark.membershipGet"></a>

### Spark.membershipGet(membershipId) ⇒ <code>[Promise.&lt;Membership&gt;](#Membership)</code>
Returns Spark Membership by ID.

**Kind**: static method of <code>[Spark](#Spark)</code>  
**Returns**: <code>[Promise.&lt;Membership&gt;](#Membership)</code> - Membership  

| Param | Type | Description |
| --- | --- | --- |
| membershipId | <code>String</code> | Spark Membership ID |

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
<a name="Spark.membershipAdd"></a>

### Spark.membershipAdd(roomId, personEmail, [isModerator]) ⇒ <code>[Promise.&lt;Membership&gt;](#Membership)</code>
Add new Spark Membership given Room ID, email address, and moderator status.

**Kind**: static method of <code>[Spark](#Spark)</code>  
**Returns**: <code>[Promise.&lt;Membership&gt;](#Membership)</code> - Membership  

| Param | Type | Description |
| --- | --- | --- |
| roomId | <code>String</code> | Spark Room ID |
| personEmail | <code>String</code> | Email address of person to add |
| [isModerator] | <code>Boolean</code> | True if moderator |

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
<a name="Spark.membershipUpdate"></a>

### Spark.membershipUpdate(membership) ⇒ <code>[Promise.&lt;Membership&gt;](#Membership)</code>
Update a Membership.

**Kind**: static method of <code>[Spark](#Spark)</code>  

| Param | Type | Description |
| --- | --- | --- |
| membership | <code>[Object.&lt;Membership&gt;](#Membership)</code> | Spark Membership Object |

**Example**  
```js
spark.membershipGet('Tm90aGluZyB0byBzZWUgaGVyZS4uLiBNb3ZlIGFsb25nLi4u')
  .then(function(membership) {
    // change value of retrieved membership object
    membership.isModerator = true;
    return spark.membershipUpdate(membership);
  )
  .then(function(membership) {
    console.log(membership.isModerator);
  })
  .catch(function(err) {
    // process error
    console.log(err);
  });
```
<a name="Spark.membershipRemove"></a>

### Spark.membershipRemove(membershipId) ⇒ <code>Promise</code>
Remove Spark Membership by ID.

**Kind**: static method of <code>[Spark](#Spark)</code>  

| Param | Type | Description |
| --- | --- | --- |
| membershipId | <code>String</code> | Spark Membership ID |

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
<a name="Spark.messagesGet"></a>

### Spark.messagesGet(messageSearch, [max]) ⇒ <code>[Promise.Array.&lt;Message&gt;](#Message)</code>
Returns Spark Message Objects. If 'max' is not specifed, returns all.

**Kind**: static method of <code>[Spark](#Spark)</code>  
**Returns**: <code>[Promise.Array.&lt;Message&gt;](#Message)</code> - Message Collection  

| Param | Type | Description |
| --- | --- | --- |
| messageSearch | <code>[Object.&lt;MessageSearch&gt;](#MessageSearch)</code> | Spark Message Search Object |
| [max] | <code>Integer</code> | Number of records to return (optional) |

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
<a name="Spark.messageGet"></a>

### Spark.messageGet(messageId) ⇒ <code>[Promise.&lt;Message&gt;](#Message)</code>
Return details of Spark Message by ID.

**Kind**: static method of <code>[Spark](#Spark)</code>  
**Returns**: <code>[Promise.&lt;Message&gt;](#Message)</code> - Message  

| Param | Type | Description |
| --- | --- | --- |
| messageId | <code>String</code> | Spark Message ID |

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
<a name="Spark.messageAdd"></a>

### Spark.messageAdd(message, [file]) ⇒ <code>[Promise.&lt;Message&gt;](#Message)</code>
Add new Spark Message.

**Kind**: static method of <code>[Spark](#Spark)</code>  
**Returns**: <code>[Promise.&lt;Message&gt;](#Message)</code> - Message  

| Param | Type | Description |
| --- | --- | --- |
| message | <code>[Object.&lt;MessageAdd&gt;](#MessageAdd)</code> | Spark Message Add Object |
| [file] | <code>[Object.&lt;File&gt;](#File)</code> | File Object to add to message (optional) |

**Example**  
```js
let newMessage = {
  roomId: 'Tm90aGluZyB0byBzZWUgaGVyZS4uLiBNb3ZlIGFsb25nLi4u',
  text: 'Hello World'
};

spark.contentCreate('/some/file/with.ext')
  .then(function(file) {
    return spark.messageAdd(newMessage, file);
  })
  .then(function(message) {
    console.log(message.id);
  })
  .catch(function(err) {
    // process error
    console.log(err);
  });
```
<a name="Spark.messageRemove"></a>

### Spark.messageRemove(messageId) ⇒ <code>Promise</code>
Remove Spark Message by ID.

**Kind**: static method of <code>[Spark](#Spark)</code>  
**Returns**: <code>Promise</code> - message  

| Param | Type | Description |
| --- | --- | --- |
| messageId | <code>String</code> | Spark Message ID |

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
<a name="Spark.organizationsGet"></a>

### Spark.organizationsGet([max]) ⇒ <code>[Promise.Array.&lt;Organization&gt;](#Organization)</code>
Return all Spark Organizations that the authenticated account is in. If 'max' is not specifed, returns all.

**Kind**: static method of <code>[Spark](#Spark)</code>  
**Returns**: <code>[Promise.Array.&lt;Organization&gt;](#Organization)</code> - Organizations Collection  

| Param | Type | Description |
| --- | --- | --- |
| [max] | <code>Integer</code> | Number of records to return (optional) |

**Example**  
```js
spark.organizationsGet(100)
  .then(function(organizations) {
    // process organizations as array
    organizations.forEach(function(organization) {
      console.log(organization.displayName);
    });
  })
  .catch(function(err) {
    // process error
    console.log(err);
  });
```
<a name="Spark.organizationGet"></a>

### Spark.organizationGet(orgId) ⇒ <code>[Promise.&lt;Organization&gt;](#Organization)</code>
Return Spark Organization specified by License ID.

**Kind**: static method of <code>[Spark](#Spark)</code>  

| Param | Type | Description |
| --- | --- | --- |
| orgId | <code>String</code> | Spark Organization ID |

**Example**  
```js
spark.organizationGet('Tm90aGluZyB0byBzZWUgaGVyZS4uLiBNb3ZlIGFsb25nLi4u')
  .then(function(organization) {
    console.log(organization.displayName);
  })
  .catch(function(err) {
    // process error
    console.log(err);
  });
```
<a name="Spark.peopleGet"></a>

### Spark.peopleGet([personSearch], [max]) ⇒ <code>[Promise.Array.&lt;Person&gt;](#Person)</code>
Returns Spark Person Objects. If no arguments are passed and if the authenticated account is part of an Organization and if authenticated account is assigned the Role of Organization Admin, returns all Spark Person objects from the Organizations that the user is in. Otherwise, the PersonSearch object should contain the key "id", "displayName", or "email" to query. If 'max' is not specifed, returns all matched Person Objects.

**Kind**: static method of <code>[Spark](#Spark)</code>  
**Returns**: <code>[Promise.Array.&lt;Person&gt;](#Person)</code> - People Collection  

| Param | Type | Description |
| --- | --- | --- |
| [personSearch] | <code>[Object.&lt;PersonSearch&gt;](#PersonSearch)</code> | Spark Person Search Object (optional) |
| [max] | <code>Integer</code> | Number of records to return (optional) |

**Example**  
```js
spark.peopleGet({ displayName: 'John' }, 10)
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
<a name="Spark.personGet"></a>

### Spark.personGet(personId) ⇒ <code>[Promise.&lt;Person&gt;](#Person)</code>
Returns a Spark Person Object specified by Person ID.

**Kind**: static method of <code>[Spark](#Spark)</code>  
**Returns**: <code>[Promise.&lt;Person&gt;](#Person)</code> - Person  

| Param | Type | Description |
| --- | --- | --- |
| personId | <code>String</code> | Spark Person ID |

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
<a name="Spark.personMe"></a>

### Spark.personMe() ⇒ <code>[Promise.&lt;Person&gt;](#Person)</code>
Return the Spark Person Object of the authenticated account.

**Kind**: static method of <code>[Spark](#Spark)</code>  
**Returns**: <code>[Promise.&lt;Person&gt;](#Person)</code> - Person  
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
<a name="Spark.personAdd"></a>

### Spark.personAdd(person) ⇒ <code>[Promise.&lt;Person&gt;](#Person)</code>
Add new Person.

**Kind**: static method of <code>[Spark](#Spark)</code>  
**Returns**: <code>[Promise.&lt;Person&gt;](#Person)</code> - Person  

| Param | Type | Description |
| --- | --- | --- |
| person | <code>[Object.&lt;Person&gt;](#Person)</code> | Spark Person Object |

**Example**  
```js
let newPerson = {
  emails: ['aperson@company.com'],
  displayName: 'Any Person',
  firstName: 'Any',
  lastName: 'Person',
  avatar: 'http://lorempixel.com/400/400/',
  orgId: 'Tm90aGluZyB0byBzZWUgaGVyZS4uLiBNb3ZlIGFsb25nLi4u',
  roles: ['Tm90aGluZyB0byBzZWUgaGVyZS4uLiBNb3ZlIGFsb25nLi4u'],
  licenses: ['Tm90aGluZyB0byBzZWUgaGVyZS4uLiBNb3ZlIGFsb25nLi4u']
};

spark.personAdd(newPerson)
  .then(function(person) {
    console.log(person.displayName);
  })
  .catch(function(err) {
    // process error
    console.log(err);
  });
```
<a name="Spark.personUpdate"></a>

### Spark.personUpdate(person) ⇒ <code>[Promise.&lt;Person&gt;](#Person)</code>
Update a Person.

**Kind**: static method of <code>[Spark](#Spark)</code>  
**Returns**: <code>[Promise.&lt;Person&gt;](#Person)</code> - Person  

| Param | Type | Description |
| --- | --- | --- |
| person | <code>[Object.&lt;Person&gt;](#Person)</code> | Spark Person Object |

**Example**  
```js
spark.personGet(Tm90aGluZyB0byBzZWUgaGVyZS4uLiBNb3ZlIGFsb25nLi4u)
  .then(function(person) {
    // change value of retrieved person object
    person.displayName = 'Another Person';
    return spark.personUpdate(person);
  )
  .then(function(person) {
    console.log(person.displayName);
  })
  .catch(function(err) {
    // process error
    console.log(err);
  });
```
<a name="Spark.personRemove"></a>

### Spark.personRemove(personId) ⇒ <code>Promise</code>
Remove Spark Person by ID.

**Kind**: static method of <code>[Spark](#Spark)</code>  

| Param | Type | Description |
| --- | --- | --- |
| personId | <code>String</code> | Spark Person ID |

**Example**  
```js
spark.personRemove('Tm90aGluZyB0byBzZWUgaGVyZS4uLiBNb3ZlIGFsb25nLi4u')
  .then(function() {
    console.log('Person removed.');
  })
  .catch(function(err) {
    // process error
    console.log(err);
  });
```
<a name="Spark.rolesGet"></a>

### Spark.rolesGet([max]) ⇒ <code>[Promise.Array.&lt;Role&gt;](#Role)</code>
Returns all Spark Roles that the authenticated account is in. If 'max' is not specifed, returns all.

**Kind**: static method of <code>[Spark](#Spark)</code>  

| Param | Type | Description |
| --- | --- | --- |
| [max] | <code>Integer</code> | Number of records to return (optional) |

**Example**  
```js
spark.rolesGet(100)
  .then(function(roles) {
    // process roles as array
    roles.forEach(function(role) {
      console.log(role.name);
    });
  })
  .catch(function(err) {
    // process error
    console.log(err);
  });
```
<a name="Spark.roleGet"></a>

### Spark.roleGet(roleId) ⇒ <code>[Promise.&lt;Role&gt;](#Role)</code>
Returns details for a Spark Role pecified by Role ID.

**Kind**: static method of <code>[Spark](#Spark)</code>  

| Param | Type | Description |
| --- | --- | --- |
| roleId | <code>String</code> | Spark Role ID |

**Example**  
```js
spark.roleGet('Tm90aGluZyB0byBzZWUgaGVyZS4uLiBNb3ZlIGFsb25nLi4u')
  .then(function(role) {
    console.log(role.name);
  })
  .catch(function(err) {
    // process error
    console.log(err);
  });
```
<a name="Spark.roomsGet"></a>

### Spark.roomsGet([roomSearch], [max]) ⇒ <code>[Promise.Array.&lt;Room&gt;](#Room)</code>
Returns Spark Room Objects. If roomSearch argument is not passed, returns all Spark Rooms that the authenticated account is in. If 'max' is not specifed, returns all.

**Kind**: static method of <code>[Spark](#Spark)</code>  
**Returns**: <code>[Promise.Array.&lt;Room&gt;](#Room)</code> - Rooms Collection  

| Param | Type | Description |
| --- | --- | --- |
| [roomSearch] | <code>[Object.&lt;RoomSearch&gt;](#RoomSearch)</code> | Spark Person Search Object (optional) |
| [max] | <code>Integer</code> | Number of records to return (optional) |

**Example**  
```js
spark.roomsGet({ type: 'group' }, 10)
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
<a name="Spark.roomGet"></a>

### Spark.roomGet(roomId) ⇒ <code>[Promise.&lt;Room&gt;](#Room)</code>
Returns a Spark Room Object specified by Room ID.

**Kind**: static method of <code>[Spark](#Spark)</code>  
**Returns**: <code>[Promise.&lt;Room&gt;](#Room)</code> - Room  

| Param | Type | Description |
| --- | --- | --- |
| roomId | <code>String</code> | Spark Room ID |

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
<a name="Spark.roomAdd"></a>

### Spark.roomAdd(title, [teamId]) ⇒ <code>[Promise.&lt;Room&gt;](#Room)</code>
Add new Spark Room.

**Kind**: static method of <code>[Spark](#Spark)</code>  
**Returns**: <code>[Promise.&lt;Room&gt;](#Room)</code> - Room  

| Param | Type | Description |
| --- | --- | --- |
| title | <code>String</code> | Title for a new Room |
| [teamId] | <code>String</code> | Team ID (optional) |

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
<a name="Spark.roomUpdate"></a>

### Spark.roomUpdate(room) ⇒ <code>[Promise.&lt;Room&gt;](#Room)</code>
Update a Spark Room.

**Kind**: static method of <code>[Spark](#Spark)</code>  
**Returns**: <code>[Promise.&lt;Room&gt;](#Room)</code> - Room  

| Param | Type | Description |
| --- | --- | --- |
| room | <code>[Object.&lt;Room&gt;](#Room)</code> | Spark Room Object |

**Example**  
```js
spark.roomGet(Tm90aGluZyB0byBzZWUgaGVyZS4uLiBNb3ZlIGFsb25nLi4u)
  .then(function(room) {
    // change value of retrieved room object
    room.title = 'Another Title';
    return spark.roomUpdate(room);
  )
  .then(function(room) {
    console.log(room.title);
  })
  .catch(function(err) {
    // process error
    console.log(err);
  });
```
<a name="Spark.roomRemove"></a>

### Spark.roomRemove(roomId) ⇒ <code>Promise</code>
Remove Spark Room by ID.

**Kind**: static method of <code>[Spark](#Spark)</code>  

| Param | Type | Description |
| --- | --- | --- |
| roomId | <code>String</code> | Spark Room ID |

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
<a name="Spark.teamsGet"></a>

### Spark.teamsGet([max]) ⇒ <code>[Promise.Array.&lt;Team&gt;](#Team)</code>
Return all Spark Teams that the authenticated account is in. If 'max' is not specifed, returns all.

**Kind**: static method of <code>[Spark](#Spark)</code>  
**Returns**: <code>[Promise.Array.&lt;Team&gt;](#Team)</code> - Teams Collection  

| Param | Type | Description |
| --- | --- | --- |
| [max] | <code>Integer</code> | Number of records to return (optional) |

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
<a name="Spark.teamGet"></a>

### Spark.teamGet(teamId) ⇒ <code>[Promise.&lt;Team&gt;](#Team)</code>
Returns a Spark Team Object specified by Team ID.

**Kind**: static method of <code>[Spark](#Spark)</code>  
**Returns**: <code>[Promise.&lt;Team&gt;](#Team)</code> - Team  

| Param | Type | Description |
| --- | --- | --- |
| teamId | <code>String</code> | Spark Team ID |

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
<a name="Spark.teamAdd"></a>

### Spark.teamAdd(name) ⇒ <code>[Promise.&lt;Team&gt;](#Team)</code>
Add new Spark Team.

**Kind**: static method of <code>[Spark](#Spark)</code>  
**Returns**: <code>[Promise.&lt;Team&gt;](#Team)</code> - Team  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>String</code> | Name for new Team |

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
<a name="Spark.teamUpdate"></a>

### Spark.teamUpdate(team) ⇒ <code>[Promise.&lt;Team&gt;](#Team)</code>
Update a Team.

**Kind**: static method of <code>[Spark](#Spark)</code>  
**Returns**: <code>[Promise.&lt;Team&gt;](#Team)</code> - Team  

| Param | Type | Description |
| --- | --- | --- |
| team | <code>[Object.&lt;Team&gt;](#Team)</code> | Spark Team Object |

**Example**  
```js
spark.teamGet('Tm90aGluZyB0byBzZWUgaGVyZS4uLiBNb3ZlIGFsb25nLi4u')
  .then(function(team) {
    // change value of retrieved team object
    team.name = 'Another Team';
    return spark.teamUpdate(team);
  )
  .then(function(team) {
    console.log(team.name);
  })
  .catch(function(err) {
    // process error
    console.log(err);
  });
```
<a name="Spark.teamRemove"></a>

### Spark.teamRemove(teamId) ⇒ <code>Promise</code>
Remove Spark Team by ID.

**Kind**: static method of <code>[Spark](#Spark)</code>  

| Param | Type | Description |
| --- | --- | --- |
| teamId | <code>String</code> | Spark Team ID |

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
<a name="Spark.teamMembershipsGet"></a>

### Spark.teamMembershipsGet(teamId, [max]) ⇒ <code>[Promise.Array.&lt;TeamMembership&gt;](#TeamMembership)</code>
Return all Spark Team Memberships for a specific Team that the authenticated account is in. If 'max' is not specifed, returns all.

**Kind**: static method of <code>[Spark](#Spark)</code>  
**Returns**: <code>[Promise.Array.&lt;TeamMembership&gt;](#TeamMembership)</code> - TeamMemberships Collection  

| Param | Type | Description |
| --- | --- | --- |
| teamId | <code>String</code> | Spark Team ID |
| [max] | <code>Integer</code> | Number of records to return |

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
<a name="Spark.teamMembershipGet"></a>

### Spark.teamMembershipGet(membershipId) ⇒ <code>[Promise.&lt;TeamMembership&gt;](#TeamMembership)</code>
Return Spark Team Membership specified by Membership ID.

**Kind**: static method of <code>[Spark](#Spark)</code>  
**Returns**: <code>[Promise.&lt;TeamMembership&gt;](#TeamMembership)</code> - TeamMembership  

| Param | Type | Description |
| --- | --- | --- |
| membershipId | <code>String</code> | Spark Membership ID |

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
<a name="Spark.teamMembershipAdd"></a>

### Spark.teamMembershipAdd(teamId, personEmail, isModerator) ⇒ <code>[Promise.&lt;TeamMembership&gt;](#TeamMembership)</code>
Add new Spark Team Membership.

**Kind**: static method of <code>[Spark](#Spark)</code>  
**Returns**: <code>[Promise.&lt;TeamMembership&gt;](#TeamMembership)</code> - TeamMembership  

| Param | Type | Description |
| --- | --- | --- |
| teamId | <code>String</code> | Spark Team ID |
| personEmail | <code>String</code> | Email address of person to add |
| isModerator | <code>Boolean</code> | Boolean value to add as moderator |

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
<a name="Spark.teamMembershipUpdate"></a>

### Spark.teamMembershipUpdate(teamMembership) ⇒ <code>[Promise.&lt;TeamMembership&gt;](#TeamMembership)</code>
Update a Team Membership.

**Kind**: static method of <code>[Spark](#Spark)</code>  
**Returns**: <code>[Promise.&lt;TeamMembership&gt;](#TeamMembership)</code> - TeamMembership  

| Param | Type | Description |
| --- | --- | --- |
| teamMembership | <code>[Object.&lt;TeamMembership&gt;](#TeamMembership)</code> | Spark TeamMembership Object |

**Example**  
```js
spark.teamMembershipGet(Tm90aGluZyB0byBzZWUgaGVyZS4uLiBNb3ZlIGFsb25nLi4u)
  .then(function(teamMembership) {
    // change value of retrieved teamMembership object
    teamMembership.isModerator = true;
    return spark.teamMembershipUpdate(teamMembership);
  )
  .then(function(teamMembership) {
    console.log(teamMembership.isModerator);
  })
  .catch(function(err) {
    // process error
    console.log(err);
  });
```
<a name="Spark.teamMembershipRemove"></a>

### Spark.teamMembershipRemove(membershipId) ⇒ <code>Promise</code>
Remove Spark Team Membership by ID..

**Kind**: static method of <code>[Spark](#Spark)</code>  

| Param | Type | Description |
| --- | --- | --- |
| membershipId | <code>String</code> | Spark Membership ID |

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
<a name="Spark.webhooksGet"></a>

### Spark.webhooksGet([max]) ⇒ <code>[Promise.Array.&lt;Webhook&gt;](#Webhook)</code>
Return all Spark Webhooks that the authenticated account is in. If 'max' is not specifed, returns all.

**Kind**: static method of <code>[Spark](#Spark)</code>  
**Returns**: <code>[Promise.Array.&lt;Webhook&gt;](#Webhook)</code> - Webhooks Collection  

| Param | Type | Description |
| --- | --- | --- |
| [max] | <code>Integer</code> | Number of records to return |

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
<a name="Spark.webhookGet"></a>

### Spark.webhookGet(webhookId) ⇒ <code>[Promise.&lt;Webhook&gt;](#Webhook)</code>
Returns details of Spark Webhook Object specified by Webhook ID.

**Kind**: static method of <code>[Spark](#Spark)</code>  
**Returns**: <code>[Promise.&lt;Webhook&gt;](#Webhook)</code> - Webhook  

| Param | Type | Description |
| --- | --- | --- |
| webhookId | <code>String</code> | Spark Webhook ID |

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
<a name="Spark.webhookAdd"></a>

### Spark.webhookAdd(webhook) ⇒ <code>[Promise.&lt;Webhook&gt;](#Webhook)</code>
Add new Webhook.

**Kind**: static method of <code>[Spark](#Spark)</code>  
**Returns**: <code>[Promise.&lt;Webhook&gt;](#Webhook)</code> - Webhook  

| Param | Type | Description |
| --- | --- | --- |
| webhook | <code>[Object.&lt;Webhook&gt;](#Webhook)</code> | Spark Webhook Object |

**Example**  
```js
let newWebhook = {
  name: 'my webhook',
  targetUrl: 'https://example.com/webhook',
  resource: 'memberships',
  event: 'created',
  filter: 'roomId=Tm90aGluZyB0byBzZWUgaGVyZS4uLiBNb3ZlIGFsb25nLi4u'
};

spark.webhookAdd(newWebhook)
  .then(function(webhook) {
    console.log(webhook.name);
  })
  .catch(function(err) {
    // process error
    console.log(err);
  });
```
<a name="Spark.webhookUpdate"></a>

### Spark.webhookUpdate(webhook) ⇒ <code>[Promise.&lt;Webhook&gt;](#Webhook)</code>
Update a Webhook.

**Kind**: static method of <code>[Spark](#Spark)</code>  
**Returns**: <code>[Promise.&lt;Webhook&gt;](#Webhook)</code> - Webhook  

| Param | Type | Description |
| --- | --- | --- |
| webhook | <code>[Object.&lt;Webhook&gt;](#Webhook)</code> | Spark Webhook Object |

**Example**  
```js
spark.webhookGet(Tm90aGluZyB0byBzZWUgaGVyZS4uLiBNb3ZlIGFsb25nLi4u)
  .then(function(webhook) {
    // change value of retrieved webhook object
    webhook.name = 'Another Webhook';
    return spark.webhookUpdate(webhook);
  )
  .then(function(webhook) {
    console.log(webhook.name);
  })
  .catch(function(err) {
    // process error
    console.log(err);
  });
```
<a name="Spark.webhookRemove"></a>

### Spark.webhookRemove(webhookId) ⇒ <code>Promise</code>
Remove Spark Webhook by ID.

**Kind**: static method of <code>[Spark](#Spark)</code>  

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
<a name="Spark.webhookAuth"></a>

### Spark.webhookAuth(secret, signature, payload) ⇒ <code>Promise.String</code> &#124; <code>Object</code>
Authenticate X-Spark-Signature HMAC-SHA1 Hash.

**Kind**: static method of <code>[Spark](#Spark)</code>  
**Returns**: <code>Promise.String</code> &#124; <code>Object</code> - payload  

| Param | Type | Description |
| --- | --- | --- |
| secret | <code>String</code> | Value of secret used when creating webhook |
| signature | <code>String</code> | Value of "X-Spark-Signature" from header |
| payload | <code>String</code> &#124; <code>Object</code> | This can either be the json object or a string representation of the webhook's body json payload |

**Example**  
```js
let sig = req.headers['x-spark-signature'];
let secret = 'mySecret';

spark.webhookAuth(secret, sig, req.body)
  .then(function() {
    // webhook is valid
  })
  .catch(function(err) {
    // webhook is invalid
  });
```
<a name="Spark.webhookListen"></a>

### Spark.webhookListen() ⇒ <code>[webhookHandler](#Spark.webhookListen..webhookHandler)</code>
Process request from connect, express, or resitify routes. Return function
that accepts req, res, and next arguments.

**Kind**: static method of <code>[Spark](#Spark)</code>  
**Returns**: <code>[webhookHandler](#Spark.webhookListen..webhookHandler)</code> - function  
**Example**  
```js
"use strict";

const Spark = require('node-sparky');
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const spark = new Spark({ token: 'myToken'});

// add events
spark.on('messages', function(event, message, req) {
  if(event === 'created') {
    spark.messageGet(message.id)
      .then(function(message) {
        console.log('%s said %s', message.personEmail, message.text);
      })
      .catch(function(err) {
        console.log(err);
      });
  }
});

spark.on('request', function(req) {
  console.log('%s.%s web hook received', hook.resource, hook.event);
});

const app = express();
app.use(bodyParser.json());

// add route for path that which is listening for web hooks
app.post('/webhook', spark.webhookListen());

// start express server
const server = app.listen('3000', function() {
  // create spark webhook directed back to express route defined above
  spark.webhookAdd({
    name: 'my webhook',
    targetUrl: 'https://example.com/webhook',
    resource: 'messages',
    event: 'created'
  });
  console.log('Listening on port %s', '3000');
});
```
<a name="Spark.webhookListen..webhookHandler"></a>

#### webhookListen~webhookHandler(req, [res], [next])
Function returned by spark.webhookListen()

**Kind**: inner method of <code>[webhookListen](#Spark.webhookListen)</code>  

| Param | Type | Description |
| --- | --- | --- |
| req | <code>Object</code> | request object |
| [res] | <code>Object</code> | response object |
| [next] | <code>function</code> | next function |

<a name="File"></a>

## File : <code>object</code>
File Object

**Kind**: global namespace  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| name | <code>String</code> | File name |
| ext | <code>String</code> | File extension |
| type | <code>String</code> | Header [content-type] for file |
| binary | <code>Buffer</code> | File contents as binary |
| base64 | <code>String</code> | File contents as base64 encoded string |

<a name="License"></a>

## License : <code>object</code>
License Object

**Kind**: global namespace  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| id | <code>String</code> | License ID |
| name | <code>String</code> | License name |
| totalUnits | <code>Integer</code> | Total units of license available |
| consumedUnits | <code>Integer</code> | Number of license units consumed |

<a name="Membership"></a>

## Membership : <code>object</code>
Membership Object

**Kind**: global namespace  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| id | <code>String</code> | Membership ID |
| roomId | <code>String</code> | Room ID |
| personId | <code>String</code> | Person ID |
| personEmail | <code>String</code> | Person Email |
| isModerator | <code>Boolean</code> | Membership is a moderator |
| isMonitor | <code>Boolean</code> | Membership is a monitor |
| created | <code>Date</code> | Date Membership created |

<a name="MembershipSearch"></a>

## MembershipSearch : <code>object</code>
Membership Search Object

**Kind**: global namespace  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| roomId | <code>String</code> | Room ID |
| personId | <code>String</code> | Person ID |
| personEmail | <code>String</code> | Person Email |

<a name="Message"></a>

## Message : <code>object</code>
Message Object

**Kind**: global namespace  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| id | <code>String</code> | Message ID |
| roomId | <code>String</code> | Room ID |
| roomType | <code>String</code> | Room Type |
| toPersonId | <code>String</code> | Person ID |
| toPersonEmail | <code>String</code> | Person Email |
| text | <code>String</code> | Message text |
| markdown | <code>String</code> | Message markdown |
| files | <code>Array.&lt;String&gt;</code> | Array of File URLs |
| personId | <code>String</code> | Person ID |
| personEmail | <code>String</code> | Person Email |
| created | <code>Date</code> | Date Message created |
| mentionedPeople | <code>Array.String</code> | Person IDs of those mentioned in Message |

<a name="MessageSearch"></a>

## MessageSearch : <code>object</code>
Message Search Object

**Kind**: global namespace  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| roomId | <code>String</code> | Room ID |
| mentionedPeople | <code>String</code> | Person ID or "me" |
| before | <code>Date</code> | Date |
| beforeMessage | <code>String</code> | Message ID |

<a name="MessageAdd"></a>

## MessageAdd : <code>object</code>
Message Add Object

**Kind**: global namespace  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| roomId | <code>String</code> | Room ID |
| toPersonId | <code>String</code> | Person ID |
| toPersonEmail | <code>String</code> | Person Email |
| text | <code>String</code> | Message as Text |
| markdown | <code>String</code> | Message as Markdown |

<a name="Organization"></a>

## Organization : <code>object</code>
Organization Object

**Kind**: global namespace  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| id | <code>String</code> | Organization ID |
| displayName | <code>String</code> | Organization name |
| created | <code>Date</code> | Date Organization created |

<a name="Person"></a>

## Person : <code>object</code>
Person Object

**Kind**: global namespace  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| id | <code>String</code> | Person ID |
| emails | <code>Array.String</code> | Array of email addresses |
| displayName | <code>String</code> | Display name |
| firstName | <code>String</code> | First name |
| lastName | <code>String</code> | Last name |
| avatar | <code>String</code> | Avatar URL |
| orgId | <code>String</code> | Organization ID |
| roles | <code>Array.String</code> | Array of assigned Role IDs |
| licenses | <code>Array.String</code> | Array of assigned License IDs |
| created | <code>Date</code> | Date created |

<a name="PersonSearch"></a>

## PersonSearch : <code>object</code>
Person Search Object

**Kind**: global namespace  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| id | <code>String</code> | Person ID |
| email | <code>String</code> | Person email addresses |
| displayName | <code>String</code> | Display name |

<a name="Role"></a>

## Role : <code>object</code>
Role Object

**Kind**: global namespace  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| id | <code>String</code> | Role ID |
| name | <code>String</code> | Role name |

<a name="Room"></a>

## Room : <code>object</code>
Room Object

**Kind**: global namespace  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| id | <code>String</code> | Room ID |
| title | <code>String</code> | Room Title |
| type | <code>String</code> | Room Type |
| isLocked | <code>Boolean</code> | Room Moderated/Locked |
| teamId | <code>String</code> | Team ID |
| lastActivity | <code>Date</code> | Last Activity in Room |
| creatorId | <code>Date</code> | person ID of Room creator |
| created | <code>Date</code> | Room Created |

<a name="RoomSearch"></a>

## RoomSearch : <code>object</code>
Room Search Object

**Kind**: global namespace  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| teamId | <code>String</code> | Team ID |
| type | <code>String</code> | Room type |

<a name="Team"></a>

## Team : <code>object</code>
Team Object

**Kind**: global namespace  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| id | <code>String</code> | Message ID |
| name | <code>String</code> | Team name |
| created | <code>Date</code> | Date Team created |

<a name="TeamMembership"></a>

## TeamMembership : <code>object</code>
Team Membership Object

**Kind**: global namespace  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| id | <code>String</code> | Membership ID |
| teamId | <code>String</code> | Team ID |
| personId | <code>String</code> | Person ID |
| personEmail | <code>String</code> | Person Email |
| isModerator | <code>boolean</code> | Membership is a moderator |
| created | <code>date</code> | Date Membership created |

<a name="Webhook"></a>

## Webhook : <code>object</code>
Webhook Object

**Kind**: global namespace  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| id | <code>String</code> | Webhook ID |
| name | <code>String</code> | Webhook name |
| targetUrl | <code>String</code> | Webhook target URL |
| resource | <code>String</code> | Webhook resource |
| event | <code>String</code> | Webhook event |
| filter | <code>String</code> | Webhook filter |
| created | <code>Date</code> | Date Webhook created |

<a name="Validator"></a>

## Validator : <code>object</code>
Spark Object Validation

**Kind**: global namespace  

* [Validator](#Validator) : <code>object</code>
    * [.fileExists(filePath)](#Validator.fileExists) ⇒ <code>Boolean</code>
    * [.dirExists(dirPath)](#Validator.dirExists) ⇒ <code>Boolean</code>
    * [.isEmail(email)](#Validator.isEmail) ⇒ <code>Boolean</code>
    * [.isEmails(emails)](#Validator.isEmails) ⇒ <code>Boolean</code>
    * [.isUrl(url)](#Validator.isUrl) ⇒ <code>Boolean</code>
    * [.isFilePath(path)](#Validator.isFilePath) ⇒ <code>Boolean</code>
    * [.isFile(file)](#Validator.isFile) ⇒ <code>Boolean</code>
    * [.isLicense(object)](#Validator.isLicense) ⇒ <code>Boolean</code>
    * [.isLicenses(licenses)](#Validator.isLicenses) ⇒ <code>Boolean</code>
    * [.isMembership(object)](#Validator.isMembership) ⇒ <code>Boolean</code>
    * [.isMemberships(memberships)](#Validator.isMemberships) ⇒ <code>Boolean</code>
    * [.isMembershipSearch(object)](#Validator.isMembershipSearch) ⇒ <code>Boolean</code>
    * [.isMessage(object)](#Validator.isMessage) ⇒ <code>Boolean</code>
    * [.isMessages(messages)](#Validator.isMessages) ⇒ <code>Boolean</code>
    * [.isMessageSearch(object)](#Validator.isMessageSearch) ⇒ <code>Boolean</code>
    * [.isOrganization(object)](#Validator.isOrganization) ⇒ <code>Boolean</code>
    * [.isOrganizations(organizations)](#Validator.isOrganizations) ⇒ <code>Boolean</code>
    * [.isPerson(object)](#Validator.isPerson) ⇒ <code>Boolean</code>
    * [.isPeople(persons)](#Validator.isPeople) ⇒ <code>Boolean</code>
    * [.isPersonSearch(object)](#Validator.isPersonSearch) ⇒ <code>Boolean</code>
    * [.isRole(object)](#Validator.isRole) ⇒ <code>Boolean</code>
    * [.isRoles(roles)](#Validator.isRoles) ⇒ <code>Boolean</code>
    * [.isRoom(object)](#Validator.isRoom) ⇒ <code>Boolean</code>
    * [.isRooms(rooms)](#Validator.isRooms) ⇒ <code>Boolean</code>
    * [.isRoomSearch(object)](#Validator.isRoomSearch) ⇒ <code>Boolean</code>
    * [.isTeam(object)](#Validator.isTeam) ⇒ <code>Boolean</code>
    * [.isTeams(teams)](#Validator.isTeams) ⇒ <code>Boolean</code>
    * [.isTeamMembership(object)](#Validator.isTeamMembership) ⇒ <code>Boolean</code>
    * [.isTeamMemberships(teamMemberships)](#Validator.isTeamMemberships) ⇒ <code>Boolean</code>
    * [.isWebhook(object)](#Validator.isWebhook) ⇒ <code>Boolean</code>
    * [.isWebhooks(webhooks)](#Validator.isWebhooks) ⇒ <code>Boolean</code>

<a name="Validator.fileExists"></a>

### Validator.fileExists(filePath) ⇒ <code>Boolean</code>
Validate filePath resolves to existing file.

**Kind**: static method of <code>[Validator](#Validator)</code>  

| Param | Type |
| --- | --- |
| filePath | <code>String</code> | 

<a name="Validator.dirExists"></a>

### Validator.dirExists(dirPath) ⇒ <code>Boolean</code>
Validate dir Path resolves to existing file.

**Kind**: static method of <code>[Validator](#Validator)</code>  

| Param | Type |
| --- | --- |
| dirPath | <code>String</code> | 

<a name="Validator.isEmail"></a>

### Validator.isEmail(email) ⇒ <code>Boolean</code>
Validate String is Email.

**Kind**: static method of <code>[Validator](#Validator)</code>  

| Param | Type |
| --- | --- |
| email | <code>String</code> | 

<a name="Validator.isEmails"></a>

### Validator.isEmails(emails) ⇒ <code>Boolean</code>
Validate Emails in Array.

**Kind**: static method of <code>[Validator](#Validator)</code>  

| Param | Type |
| --- | --- |
| emails | <code>Array</code> | 

<a name="Validator.isUrl"></a>

### Validator.isUrl(url) ⇒ <code>Boolean</code>
Validate String is URL.

**Kind**: static method of <code>[Validator](#Validator)</code>  

| Param | Type |
| --- | --- |
| url | <code>String</code> | 

<a name="Validator.isFilePath"></a>

### Validator.isFilePath(path) ⇒ <code>Boolean</code>
Validate String is File path.

**Kind**: static method of <code>[Validator](#Validator)</code>  

| Param | Type |
| --- | --- |
| path | <code>String</code> | 

<a name="Validator.isFile"></a>

### Validator.isFile(file) ⇒ <code>Boolean</code>
Validate File object

**Kind**: static method of <code>[Validator](#Validator)</code>  

| Param | Type |
| --- | --- |
| file | <code>[Object.&lt;File&gt;](#File)</code> | 

<a name="Validator.isLicense"></a>

### Validator.isLicense(object) ⇒ <code>Boolean</code>
Validate Spark License Object.

**Kind**: static method of <code>[Validator](#Validator)</code>  

| Param | Type |
| --- | --- |
| object | <code>[License](#License)</code> | 

<a name="Validator.isLicenses"></a>

### Validator.isLicenses(licenses) ⇒ <code>Boolean</code>
Validate Spark License Objects in Array.

**Kind**: static method of <code>[Validator](#Validator)</code>  

| Param | Type |
| --- | --- |
| licenses | <code>Array</code> | 

<a name="Validator.isMembership"></a>

### Validator.isMembership(object) ⇒ <code>Boolean</code>
Validate Spark Membership Object.

**Kind**: static method of <code>[Validator](#Validator)</code>  

| Param | Type |
| --- | --- |
| object | <code>[Membership](#Membership)</code> | 

<a name="Validator.isMemberships"></a>

### Validator.isMemberships(memberships) ⇒ <code>Boolean</code>
Validate Spark Membership Objects in Array.

**Kind**: static method of <code>[Validator](#Validator)</code>  

| Param | Type |
| --- | --- |
| memberships | <code>Array</code> | 

<a name="Validator.isMembershipSearch"></a>

### Validator.isMembershipSearch(object) ⇒ <code>Boolean</code>
Validate Spark Membership Search Object.

**Kind**: static method of <code>[Validator](#Validator)</code>  

| Param | Type |
| --- | --- |
| object | <code>[MembershipSearch](#MembershipSearch)</code> | 

<a name="Validator.isMessage"></a>

### Validator.isMessage(object) ⇒ <code>Boolean</code>
Validate Spark Message Object.

**Kind**: static method of <code>[Validator](#Validator)</code>  

| Param | Type |
| --- | --- |
| object | <code>[Message](#Message)</code> | 

<a name="Validator.isMessages"></a>

### Validator.isMessages(messages) ⇒ <code>Boolean</code>
Validate Spark Message Objects in Array.

**Kind**: static method of <code>[Validator](#Validator)</code>  

| Param | Type |
| --- | --- |
| messages | <code>Array</code> | 

<a name="Validator.isMessageSearch"></a>

### Validator.isMessageSearch(object) ⇒ <code>Boolean</code>
Validate Spark Message Search Object.

**Kind**: static method of <code>[Validator](#Validator)</code>  

| Param | Type |
| --- | --- |
| object | <code>[MessageSearch](#MessageSearch)</code> | 

<a name="Validator.isOrganization"></a>

### Validator.isOrganization(object) ⇒ <code>Boolean</code>
Validate Spark Organization Object.

**Kind**: static method of <code>[Validator](#Validator)</code>  

| Param | Type |
| --- | --- |
| object | <code>[Organization](#Organization)</code> | 

<a name="Validator.isOrganizations"></a>

### Validator.isOrganizations(organizations) ⇒ <code>Boolean</code>
Validate Spark Organizations Objects in Array.

**Kind**: static method of <code>[Validator](#Validator)</code>  

| Param | Type |
| --- | --- |
| organizations | <code>Array</code> | 

<a name="Validator.isPerson"></a>

### Validator.isPerson(object) ⇒ <code>Boolean</code>
Validate Spark Person Object.

**Kind**: static method of <code>[Validator](#Validator)</code>  

| Param | Type |
| --- | --- |
| object | <code>[Room](#Room)</code> | 

<a name="Validator.isPeople"></a>

### Validator.isPeople(persons) ⇒ <code>Boolean</code>
Validate Spark Person Objects in Array.

**Kind**: static method of <code>[Validator](#Validator)</code>  

| Param | Type |
| --- | --- |
| persons | <code>Array</code> | 

<a name="Validator.isPersonSearch"></a>

### Validator.isPersonSearch(object) ⇒ <code>Boolean</code>
Validate Spark Person Search Object.

**Kind**: static method of <code>[Validator](#Validator)</code>  

| Param | Type |
| --- | --- |
| object | <code>[PersonSearch](#PersonSearch)</code> | 

<a name="Validator.isRole"></a>

### Validator.isRole(object) ⇒ <code>Boolean</code>
Validate Spark Role Object.

**Kind**: static method of <code>[Validator](#Validator)</code>  

| Param | Type |
| --- | --- |
| object | <code>[Role](#Role)</code> | 

<a name="Validator.isRoles"></a>

### Validator.isRoles(roles) ⇒ <code>Boolean</code>
Validate Spark Role Objects in Array.

**Kind**: static method of <code>[Validator](#Validator)</code>  

| Param | Type |
| --- | --- |
| roles | <code>Array</code> | 

<a name="Validator.isRoom"></a>

### Validator.isRoom(object) ⇒ <code>Boolean</code>
Validate Spark Room Object.

**Kind**: static method of <code>[Validator](#Validator)</code>  

| Param | Type |
| --- | --- |
| object | <code>[Room](#Room)</code> | 

<a name="Validator.isRooms"></a>

### Validator.isRooms(rooms) ⇒ <code>Boolean</code>
Validate Spark Room Objects in Array.

**Kind**: static method of <code>[Validator](#Validator)</code>  

| Param | Type |
| --- | --- |
| rooms | <code>Array</code> | 

<a name="Validator.isRoomSearch"></a>

### Validator.isRoomSearch(object) ⇒ <code>Boolean</code>
Validate Spark Room Search Object.

**Kind**: static method of <code>[Validator](#Validator)</code>  

| Param | Type |
| --- | --- |
| object | <code>[RoomSearch](#RoomSearch)</code> | 

<a name="Validator.isTeam"></a>

### Validator.isTeam(object) ⇒ <code>Boolean</code>
Validate Spark Team Object.

**Kind**: static method of <code>[Validator](#Validator)</code>  

| Param | Type |
| --- | --- |
| object | <code>[Team](#Team)</code> | 

<a name="Validator.isTeams"></a>

### Validator.isTeams(teams) ⇒ <code>Boolean</code>
Validate Spark Team Objects in Array.

**Kind**: static method of <code>[Validator](#Validator)</code>  

| Param | Type |
| --- | --- |
| teams | <code>Array</code> | 

<a name="Validator.isTeamMembership"></a>

### Validator.isTeamMembership(object) ⇒ <code>Boolean</code>
Validate Spark Team Membership Object.

**Kind**: static method of <code>[Validator](#Validator)</code>  

| Param | Type |
| --- | --- |
| object | <code>[TeamMembership](#TeamMembership)</code> | 

<a name="Validator.isTeamMemberships"></a>

### Validator.isTeamMemberships(teamMemberships) ⇒ <code>Boolean</code>
Validate Spark Team Membership Objects in Array.

**Kind**: static method of <code>[Validator](#Validator)</code>  

| Param | Type |
| --- | --- |
| teamMemberships | <code>Array</code> | 

<a name="Validator.isWebhook"></a>

### Validator.isWebhook(object) ⇒ <code>Boolean</code>
Validate Spark Webhook Object.

**Kind**: static method of <code>[Validator](#Validator)</code>  

| Param | Type |
| --- | --- |
| object | <code>[Webhook](#Webhook)</code> | 

<a name="Validator.isWebhooks"></a>

### Validator.isWebhooks(webhooks) ⇒ <code>Boolean</code>
Validate Spark Webhook Objects in Array.

**Kind**: static method of <code>[Validator](#Validator)</code>  

| Param | Type |
| --- | --- |
| webhooks | <code>Array</code> | 

<a name="event_memberships"></a>

## "memberships"
Webhook membership event

**Kind**: event emitted  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| event | <code>String</code> | Triggered event (created, updated, deleted) |
| membership | <code>[Object.&lt;Membership&gt;](#Membership)</code> | Membership Object found in Webhook |
| req | <code>Object.&lt;Request&gt;</code> | Full Request Object |

<a name="event_messages"></a>

## "messages"
Webhook messages event

**Kind**: event emitted  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| event | <code>String</code> | Triggered event (created, deleted) |
| message | <code>[Object.&lt;Message&gt;](#Message)</code> | Message Object found in Webhook |
| req | <code>Object.&lt;Request&gt;</code> | Full Request Object |

<a name="event_rooms"></a>

## "rooms"
Webhook rooms event

**Kind**: event emitted  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| event | <code>String</code> | Triggered event (created, updated) |
| room | <code>[Object.&lt;Room&gt;](#Room)</code> | Room Object found in Webhook |
| req | <code>Object.&lt;Request&gt;</code> | Full Request Object |

<a name="event_request"></a>

## "request"
Webhook request event

**Kind**: event emitted  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| req | <code>Object.&lt;Request&gt;</code> | Full Request Object |

## License

The MIT License (MIT)

Copyright (c) 2016-2017

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
