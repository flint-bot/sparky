# node-sparky

[![NPM](https://nodei.co/npm/node-sparky.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/node-sparky/)

#### Cisco Spark API for Node JS (Version 4)

```js
const Spark = require('node-sparky');

const spark = new Spark({ token: '<token>' });

spark.roomsGet(10)
  .then(rooms => rooms.forEach(room => console.log(room.title)))
  .catch(err => console.error(err));
```

## Features

* [Rate limiting headers](https://developer.ciscospark.com/blog/blog-details-8193.html)
  inspected to adjust request rates based on Cisco Spark API. These are
  automatically re-queued and sent after the `retry-after` timer expires.
* File processor for retrieving attachments from room.
* Returns promises that comply with [A+ standards.](https://promisesaplus.com/).
* Handles pagination transparently. (Receive unlimited records)
* Support for [authenticated HMAC-SHA1 webhooks](https://developer.ciscospark.com/webhooks-explained.html#sensitive-data)

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
    <script src="https://code.jquery.com/jquery-3.2.1.min.js"></script>
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

_**Note: The above is a simple example. It is not recommended to include the
token in anything client accessible. This would ideally be part of a broader
application that makes use of oauth2 to cross authenticate the user to Spark to
grab their token through a Spark integration should you use node-sparky in the
browser side JS.**_

## Tests

Tests require a user token and will not fully run using a bot token. It is
assumed that the user token has Org Admin permissions. If not, certain tests
WILL fail. The tests can be run via:

```bash
git clone https://github.com/flint-bot/sparky
cd sparky
npm install
TOKEN=someUserTokenHere npm test
```

## Build

The `README.md` and `browser/node-sparky.*` files are auto-generated from the
files in /lib and /docs. To regenerate these run:

```bash
npm run build
```

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
<dt><a href="#Message">Message</a> : <code>object</code></dt>
<dd><p>Message Object</p>
</dd>
<dt><a href="#Organization">Organization</a> : <code>object</code></dt>
<dd><p>Organization Object</p>
</dd>
<dt><a href="#Person">Person</a> : <code>object</code></dt>
<dd><p>Person Object</p>
</dd>
<dt><a href="#Role">Role</a> : <code>object</code></dt>
<dd><p>Role Object</p>
</dd>
<dt><a href="#Room">Room</a> : <code>object</code></dt>
<dd><p>Room Object</p>
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
<dt><a href="#event_memberships-created">"memberships-created"</a></dt>
<dd><p>Webhook Memberships Created event</p>
</dd>
<dt><a href="#event_memberships-updated">"memberships-updated"</a></dt>
<dd><p>Webhook Memberships Updated event</p>
</dd>
<dt><a href="#event_memberships-deleted">"memberships-deleted"</a></dt>
<dd><p>Webhook Memberships Deleted event</p>
</dd>
<dt><a href="#event_messages-created">"messages-created"</a></dt>
<dd><p>Webhook Messages Created event</p>
</dd>
<dt><a href="#event_messages-deleted">"messages-deleted"</a></dt>
<dd><p>Webhook Messages Deleted event</p>
</dd>
<dt><a href="#event_rooms-created">"rooms-created"</a></dt>
<dd><p>Webhook Rooms Created event</p>
</dd>
<dt><a href="#event_rooms-updated">"rooms-updated"</a></dt>
<dd><p>Webhook Rooms Updated event</p>
</dd>
<dt><a href="#event_request">"request"</a></dt>
<dd><p>Webhook request event</p>
</dd>
</dl>

<a name="Spark"></a>

## Spark
**Kind**: global class  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| options | <code>Object.&lt;Options&gt;</code> | Sparky options object |


* [Spark](#Spark)
    * [new Spark(options)](#new_Spark_new)
    * _instance_
        * [.setToken(token)](#Spark+setToken) ⇒ <code>Promise.String</code>
    * _static_
        * [.contentGet(contentId)](#Spark.contentGet) ⇒ [<code>Promise.&lt;File&gt;</code>](#File)
        * [.contentCreate(filePath, [timeout])](#Spark.contentCreate) ⇒ [<code>Promise.&lt;File&gt;</code>](#File)
        * [.licensesGet([orgId], [max])](#Spark.licensesGet) ⇒ [<code>Promise.Array.&lt;License&gt;</code>](#License)
        * [.licenseGet(licenseId)](#Spark.licenseGet) ⇒ [<code>Promise.&lt;License&gt;</code>](#License)
        * [.membershipsGet([membershipSearch], [max])](#Spark.membershipsGet) ⇒ [<code>Promise.Array.&lt;Membership&gt;</code>](#Membership)
        * [.membershipGet(membershipId)](#Spark.membershipGet) ⇒ [<code>Promise.&lt;Membership&gt;</code>](#Membership)
        * [.membershipAdd(roomId, personEmail, [isModerator])](#Spark.membershipAdd) ⇒ [<code>Promise.&lt;Membership&gt;</code>](#Membership)
        * [.membershipUpdate(membership)](#Spark.membershipUpdate) ⇒ [<code>Promise.&lt;Membership&gt;</code>](#Membership)
        * [.membershipRemove(membershipId)](#Spark.membershipRemove) ⇒ <code>Promise</code>
        * [.messagesGet(messageSearch, [max])](#Spark.messagesGet) ⇒ [<code>Promise.Array.&lt;Message&gt;</code>](#Message)
        * [.messageGet(messageId)](#Spark.messageGet) ⇒ [<code>Promise.&lt;Message&gt;</code>](#Message)
        * [.messageSend(message, [file])](#Spark.messageSend) ⇒ [<code>Promise.&lt;Message&gt;</code>](#Message)
        * [.messageRemove(messageId)](#Spark.messageRemove) ⇒ <code>Promise</code>
        * [.organizationsGet([max])](#Spark.organizationsGet) ⇒ [<code>Promise.Array.&lt;Organization&gt;</code>](#Organization)
        * [.organizationGet(orgId)](#Spark.organizationGet) ⇒ [<code>Promise.&lt;Organization&gt;</code>](#Organization)
        * [.peopleGet([personSearch], [max])](#Spark.peopleGet) ⇒ [<code>Promise.Array.&lt;Person&gt;</code>](#Person)
        * [.personGet(personId)](#Spark.personGet) ⇒ [<code>Promise.&lt;Person&gt;</code>](#Person)
        * [.personMe()](#Spark.personMe) ⇒ [<code>Promise.&lt;Person&gt;</code>](#Person)
        * [.personAdd(person)](#Spark.personAdd) ⇒ [<code>Promise.&lt;Person&gt;</code>](#Person)
        * [.personUpdate(person)](#Spark.personUpdate) ⇒ [<code>Promise.&lt;Person&gt;</code>](#Person)
        * [.personRemove(personId)](#Spark.personRemove) ⇒ <code>Promise</code>
        * [.rolesGet([max])](#Spark.rolesGet) ⇒ [<code>Promise.Array.&lt;Role&gt;</code>](#Role)
        * [.roleGet(roleId)](#Spark.roleGet) ⇒ [<code>Promise.&lt;Role&gt;</code>](#Role)
        * [.roomsGet([roomSearch], [max])](#Spark.roomsGet) ⇒ [<code>Promise.Array.&lt;Room&gt;</code>](#Room)
        * [.roomGet(roomId)](#Spark.roomGet) ⇒ [<code>Promise.&lt;Room&gt;</code>](#Room)
        * [.roomAdd(title, [teamId])](#Spark.roomAdd) ⇒ [<code>Promise.&lt;Room&gt;</code>](#Room)
        * [.roomUpdate(room)](#Spark.roomUpdate) ⇒ [<code>Promise.&lt;Room&gt;</code>](#Room)
        * [.roomRemove(roomId)](#Spark.roomRemove) ⇒ <code>Promise</code>
        * [.teamsGet([max])](#Spark.teamsGet) ⇒ [<code>Promise.Array.&lt;Team&gt;</code>](#Team)
        * [.teamGet(teamId)](#Spark.teamGet) ⇒ [<code>Promise.&lt;Team&gt;</code>](#Team)
        * [.teamAdd(name)](#Spark.teamAdd) ⇒ [<code>Promise.&lt;Team&gt;</code>](#Team)
        * [.teamUpdate(team)](#Spark.teamUpdate) ⇒ [<code>Promise.&lt;Team&gt;</code>](#Team)
        * [.teamRemove(teamId)](#Spark.teamRemove) ⇒ <code>Promise</code>
        * [.teamMembershipsGet(teamId, [max])](#Spark.teamMembershipsGet) ⇒ [<code>Promise.Array.&lt;TeamMembership&gt;</code>](#TeamMembership)
        * [.teamMembershipGet(membershipId)](#Spark.teamMembershipGet) ⇒ [<code>Promise.&lt;TeamMembership&gt;</code>](#TeamMembership)
        * [.teamMembershipAdd(teamId, personEmail, isModerator)](#Spark.teamMembershipAdd) ⇒ [<code>Promise.&lt;TeamMembership&gt;</code>](#TeamMembership)
        * [.teamMembershipUpdate(teamMembership)](#Spark.teamMembershipUpdate) ⇒ [<code>Promise.&lt;TeamMembership&gt;</code>](#TeamMembership)
        * [.teamMembershipRemove(membershipId)](#Spark.teamMembershipRemove) ⇒ <code>Promise</code>
        * [.webhooksGet([max])](#Spark.webhooksGet) ⇒ [<code>Promise.Array.&lt;Webhook&gt;</code>](#Webhook)
        * [.webhooksSearch(webhookSearch, [max])](#Spark.webhooksSearch) ⇒ [<code>Promise.Array.&lt;Webhook&gt;</code>](#Webhook)
        * [.webhookGet(webhookId)](#Spark.webhookGet) ⇒ [<code>Promise.&lt;Webhook&gt;</code>](#Webhook)
        * [.webhookAdd(webhookObj)](#Spark.webhookAdd) ⇒ [<code>Promise.&lt;Webhook&gt;</code>](#Webhook)
        * [.webhookUpdate(webhookObj)](#Spark.webhookUpdate) ⇒ [<code>Promise.&lt;Webhook&gt;</code>](#Webhook)
        * [.webhookRemove(webhookId)](#Spark.webhookRemove) ⇒ <code>Promise</code>
        * [.webhookAuth(secret, signature, payload)](#Spark.webhookAuth) ⇒ <code>Promise.String</code> \| <code>Object</code>
        * [.webhookListen()](#Spark.webhookListen) ⇒ [<code>webhookHandler</code>](#Spark.webhookListen..webhookHandler)
            * [~webhookHandler(req, [res], [next])](#Spark.webhookListen..webhookHandler) ⇒ <code>Null</code>

<a name="new_Spark_new"></a>

### new Spark(options)
Creates a Spark API instance that is then attached to a Spark Account.


| Param | Type | Description |
| --- | --- | --- |
| options | <code>Object.&lt;Options&gt;</code> | Sparky options object |

**Example**  
```js
const Spark = require('node-sparky');

const spark = new Spark({
  token: '<my token>',
  webhookSecret: 'somesecr3t',
});

spark.roomsGet(10)
  .then(rooms => rooms.forEach(room => console.log(room.title)))
  .catch(err => console.log(err);
```
<a name="Spark+setToken"></a>

### spark.setToken(token) ⇒ <code>Promise.String</code>
Set/Reset API token used in a Sparky instance. Use this function when needing
to change an expired Token. Returns a fullfiled promise if token is valid,
else returns a rejected promise.

**Kind**: instance method of [<code>Spark</code>](#Spark)  
**Returns**: <code>Promise.String</code> - Token promise  

| Param | Type | Description |
| --- | --- | --- |
| token | <code>String</code> | Spark API token |

**Example**  
```js
spark.setToken('Tm90aGluZyB0byBzZWUgaGVyZS4uLiBNb3ZlIGFsb25nLi4u')
  .then(token => console.log(token))
  .catch(err => console.error(err));
```
<a name="Spark.contentGet"></a>

### Spark.contentGet(contentId) ⇒ [<code>Promise.&lt;File&gt;</code>](#File)
Returns a File Object specified by Content ID or Content URL.

**Kind**: static method of [<code>Spark</code>](#Spark)  
**Returns**: [<code>Promise.&lt;File&gt;</code>](#File) - File object  

| Param | Type | Description |
| --- | --- | --- |
| contentId | <code>String</code> | Spark Content ID or URL |

**Example**  
```js
spark.contentGet('Tm90aGluZyB0byBzZWUgaGVy')
  .then(file => console.log('File name: %s', file.name))
  .catch(err => console.error(err));
```
<a name="Spark.contentCreate"></a>

### Spark.contentCreate(filePath, [timeout]) ⇒ [<code>Promise.&lt;File&gt;</code>](#File)
Create File Object from local file path.

**Kind**: static method of [<code>Spark</code>](#Spark)  
**Returns**: [<code>Promise.&lt;File&gt;</code>](#File) - File  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| filePath | <code>String</code> |  | Path to file |
| [timeout] | <code>Integer</code> | <code>15000</code> | Timeout in ms to read file (optional) |

**Example**  
```js
spark.contentCreate('/some/local/file.png')
  .then(file => console.log(file.name))
  .catch(err => console.error(err));
```
<a name="Spark.licensesGet"></a>

### Spark.licensesGet([orgId], [max]) ⇒ [<code>Promise.Array.&lt;License&gt;</code>](#License)
Returns all Spark Licenses for a given Organization ID. If
no organization ID argument is passed, licenses are returned for the
Organization that the authenticated account is in. If 'max' is not
specifed, returns all. Alternativly, you can pass a licenses object
instead of the orgId string.

**Kind**: static method of [<code>Spark</code>](#Spark)  
**Returns**: [<code>Promise.Array.&lt;License&gt;</code>](#License) - Licenses Collection  

| Param | Type | Description |
| --- | --- | --- |
| [orgId] | <code>String</code> | The organization ID to query (optional) |
| [max] | <code>Integer</code> | Number of records to return (optional) |

**Example**  
```js
spark.licensesGet('Tm90aGluZyB0byBzZWUgaGVy', 10)
  .then(licenses => licenses.forEach(license => console.log(license.name)))
  .catch(err => console.error(err));
```
**Example**  
```js
const licenseSearchObj = {
  orgId: 'Tm90aGluZyB0byBzZWUgaGVy',
};
spark.licensesGet(licenseSearchObj, 10)
  .then(licenses => licenses.forEach(license => console.log(license.name)))
  .catch(err => console.error(err));
```
<a name="Spark.licenseGet"></a>

### Spark.licenseGet(licenseId) ⇒ [<code>Promise.&lt;License&gt;</code>](#License)
Returns a Spark License specified by License ID.

**Kind**: static method of [<code>Spark</code>](#Spark)  
**Returns**: [<code>Promise.&lt;License&gt;</code>](#License) - License  

| Param | Type | Description |
| --- | --- | --- |
| licenseId | <code>String</code> | Spark License ID |

**Example**  
```js
spark.licenseGet('Tm90aGluZyB0byBzZWUgaGVy')
  .then(license => console.log(license.name))
  .catch(err => console.error(err));
```
<a name="Spark.membershipsGet"></a>

### Spark.membershipsGet([membershipSearch], [max]) ⇒ [<code>Promise.Array.&lt;Membership&gt;</code>](#Membership)
Returns all Spark Memberships that the authenticated account
is in. If 'max' is not specifed, returns all.

**Kind**: static method of [<code>Spark</code>](#Spark)  
**Returns**: [<code>Promise.Array.&lt;Membership&gt;</code>](#Membership) - Array of Spark Membership objects  

| Param | Type | Description |
| --- | --- | --- |
| [membershipSearch] | <code>Object</code> | Spark Membership Search Object (optional) |
| [max] | <code>Integer</code> | Number of records to return |

**Example**  
```js
spark.membershipsGet({ roomId: 'Tm90aGluZyB0byBzZWUgaGVy' }, 10)
  .then(memberships => memberships.forEach(membership => console.log(membership.id)))
  .catch(err => console.error(err));
```
<a name="Spark.membershipGet"></a>

### Spark.membershipGet(membershipId) ⇒ [<code>Promise.&lt;Membership&gt;</code>](#Membership)
Returns Spark Membership by ID.

**Kind**: static method of [<code>Spark</code>](#Spark)  
**Returns**: [<code>Promise.&lt;Membership&gt;</code>](#Membership) - Spark Membership object  

| Param | Type | Description |
| --- | --- | --- |
| membershipId | <code>String</code> | Spark Membership ID |

**Example**  
```js
spark.membershipGet('Tm90aGluZyB0byBzZWUgaGVy')
  .then(membership => console.log(membership.id))
  .catch(err => console.error(err));
```
<a name="Spark.membershipAdd"></a>

### Spark.membershipAdd(roomId, personEmail, [isModerator]) ⇒ [<code>Promise.&lt;Membership&gt;</code>](#Membership)
Add new Spark Membership given Room ID, email address, and
moderator status. Alternativly, you can pass a membership object as the
only argument.

**Kind**: static method of [<code>Spark</code>](#Spark)  
**Returns**: [<code>Promise.&lt;Membership&gt;</code>](#Membership) - Spark Membership object  

| Param | Type | Description |
| --- | --- | --- |
| roomId | <code>String</code> | Spark Room ID |
| personEmail | <code>String</code> | Email address of person to add |
| [isModerator] | <code>Boolean</code> | True if moderator |

**Example**  
```js
spark.membershipAdd('Tm90aGluZyB0byBzZWUgaGVy', 'aperson@company.com')
  .then(membership => console.log(membership.id))
  .catch(err => console.error(err));
```
**Example**  
```js
const membershipObj = {
  personEmail: 'test@test.com',
  roomId: 'Tm90aGluZyB0byBzZWUgaGVy',
  isModerator: true,
};
spark.membershipAdd(membershipObj)
  .then(membership => console.log(membership.id))
  .catch(err => console.error(err));
```
<a name="Spark.membershipUpdate"></a>

### Spark.membershipUpdate(membership) ⇒ [<code>Promise.&lt;Membership&gt;</code>](#Membership)
Update a Membership.

**Kind**: static method of [<code>Spark</code>](#Spark)  
**Returns**: [<code>Promise.&lt;Membership&gt;</code>](#Membership) - Spark Membership object  

| Param | Type | Description |
| --- | --- | --- |
| membership | [<code>Object.&lt;Membership&gt;</code>](#Membership) | Spark Membership object |

**Example**  
```js
spark.membershipGet('Tm90aGluZyB0byBzZWUgaGVy')
  .then((membership) => {
    membership.isModerator = true;
    return spark.membershipUpdate(membership);
  )
  .then(membership => console.log(membership.isModerator))
  .catch(err => console.error(err));
```
<a name="Spark.membershipRemove"></a>

### Spark.membershipRemove(membershipId) ⇒ <code>Promise</code>
Remove Spark Membership by ID.

**Kind**: static method of [<code>Spark</code>](#Spark)  
**Returns**: <code>Promise</code> - Fulfilled promise  

| Param | Type | Description |
| --- | --- | --- |
| membershipId | <code>String</code> | Spark Membership ID |

**Example**  
```js
spark.membershipRemove('Tm90aGluZyB0byBzZWUgaGVy')
  .then(() => console.log('Membership removed.'))
  .catch(err => console.error(err));
```
<a name="Spark.messagesGet"></a>

### Spark.messagesGet(messageSearch, [max]) ⇒ [<code>Promise.Array.&lt;Message&gt;</code>](#Message)
Returns Spark Message Objects. If 'max' is not specifed, returns all.

**Kind**: static method of [<code>Spark</code>](#Spark)  
**Returns**: [<code>Promise.Array.&lt;Message&gt;</code>](#Message) - Array of Spark Message objects  

| Param | Type | Description |
| --- | --- | --- |
| messageSearch | <code>Object</code> | Spark Message Search Object |
| [max] | <code>Integer</code> | Number of records to return (optional) |

**Example**  
```js
spark.messagesGet({roomId: 'Tm90aGluZyB0byBzZWUgaGVy'}, 100)
  .then(messages => messages.forEach(message => console.log(message.text)))
  .catch(err => console.error(err));
```
<a name="Spark.messageGet"></a>

### Spark.messageGet(messageId) ⇒ [<code>Promise.&lt;Message&gt;</code>](#Message)
Return details of Spark Message by ID.

**Kind**: static method of [<code>Spark</code>](#Spark)  
**Returns**: [<code>Promise.&lt;Message&gt;</code>](#Message) - Spark Message object  

| Param | Type | Description |
| --- | --- | --- |
| messageId | <code>String</code> | Spark Message ID |

**Example**  
```js
spark.messageGet('Tm90aGluZyB0byBzZWUgaGVy', 100)
  .then(message => console.log(message.text))
  .catch(err => console.error(err));
```
<a name="Spark.messageSend"></a>

### Spark.messageSend(message, [file]) ⇒ [<code>Promise.&lt;Message&gt;</code>](#Message)
Send Spark Message.

**Kind**: static method of [<code>Spark</code>](#Spark)  
**Returns**: [<code>Promise.&lt;Message&gt;</code>](#Message) - Spark Message object  

| Param | Type | Description |
| --- | --- | --- |
| message | <code>Object.&lt;MessageAdd&gt;</code> | Spark Message Add Object |
| [file] | [<code>Object.&lt;File&gt;</code>](#File) | File Object to add to message (optional) |

**Example**  
```js
const newMessage = {
  roomId: 'Tm90aGluZyB0byBzZWUgaGVy',
  text: 'Hello World'
};

spark.contentCreate('/some/file/with.ext')
  .then(file => spark.messageSend(newMessage, file))
  .then(message => console.log(message.id))
  .catch(err => console.error(err));
```
<a name="Spark.messageRemove"></a>

### Spark.messageRemove(messageId) ⇒ <code>Promise</code>
Remove Spark Message by ID.

**Kind**: static method of [<code>Spark</code>](#Spark)  
**Returns**: <code>Promise</code> - Fulfilled promise  

| Param | Type | Description |
| --- | --- | --- |
| messageId | <code>String</code> | Spark Message ID |

**Example**  
```js
spark.messageRemove('Tm90aGluZyB0byBzZWUgaGVy')
  .then(() => console.log('Message removed.'))
  .catch(err => console.error(err));
```
<a name="Spark.organizationsGet"></a>

### Spark.organizationsGet([max]) ⇒ [<code>Promise.Array.&lt;Organization&gt;</code>](#Organization)
Return all Spark Organizations that the authenticated
account is in. If 'max' is not specifed, returns all.

**Kind**: static method of [<code>Spark</code>](#Spark)  
**Returns**: [<code>Promise.Array.&lt;Organization&gt;</code>](#Organization) - Array of Spark Organization objects  

| Param | Type | Description |
| --- | --- | --- |
| [max] | <code>Integer</code> | Number of records to return (optional) |

**Example**  
```js
spark.organizationsGet(10)
  .then(organizations => organizations.forEach(organization => console.log(organization.id)))
  .catch(err => console.error(err));
```
<a name="Spark.organizationGet"></a>

### Spark.organizationGet(orgId) ⇒ [<code>Promise.&lt;Organization&gt;</code>](#Organization)
Return Spark Organization specified by License ID.

**Kind**: static method of [<code>Spark</code>](#Spark)  
**Returns**: [<code>Promise.&lt;Organization&gt;</code>](#Organization) - Spark Organization object  

| Param | Type | Description |
| --- | --- | --- |
| orgId | <code>String</code> | Spark Organization ID |

**Example**  
```js
spark.organizationGet('Tm90aGluZyB0byBzZWUgaGVy')
  .then(organization => console.log(organization.id))
  .catch(err => console.error(err));
```
<a name="Spark.peopleGet"></a>

### Spark.peopleGet([personSearch], [max]) ⇒ [<code>Promise.Array.&lt;Person&gt;</code>](#Person)
Returns Spark Person Objects. If no arguments are passed and
if the authenticated account is part of an Organization and if
authenticated account is assigned the Role of Organization Admin, returns
all Spark Person objects from the Organizations that the user is in.
Otherwise, the PersonSearch object should contain the key "id",
"displayName", or "email" to query. If 'max' is not specifed, returns all
matched Person Objects.

**Kind**: static method of [<code>Spark</code>](#Spark)  
**Returns**: [<code>Promise.Array.&lt;Person&gt;</code>](#Person) - Array of Spark Person objects  

| Param | Type | Description |
| --- | --- | --- |
| [personSearch] | <code>Object</code> | Spark Person Search Object (optional) |
| [max] | <code>Integer</code> | Number of records to return (optional) |

**Example**  
```js
spark.peopleGet({ displayName: 'John' }, 10)
  .then(people => people.forEach(person => console.log(person.displayName)))
  .catch(err => console.error(err));
```
<a name="Spark.personGet"></a>

### Spark.personGet(personId) ⇒ [<code>Promise.&lt;Person&gt;</code>](#Person)
Returns a Spark Person Object specified by Person ID.

**Kind**: static method of [<code>Spark</code>](#Spark)  
**Returns**: [<code>Promise.&lt;Person&gt;</code>](#Person) - Spark Person object  

| Param | Type | Description |
| --- | --- | --- |
| personId | <code>String</code> | Spark Person ID |

**Example**  
```js
spark.personGet('Tm90aGluZyB0byBzZWUgaGVy')
  .then(person => console.log(person.displayName))
  .catch(err => console.error(err));
```
<a name="Spark.personMe"></a>

### Spark.personMe() ⇒ [<code>Promise.&lt;Person&gt;</code>](#Person)
Return the Spark Person Object of the authenticated account.

**Kind**: static method of [<code>Spark</code>](#Spark)  
**Returns**: [<code>Promise.&lt;Person&gt;</code>](#Person) - Spark Person object  
**Example**  
```js
spark.personMe()
  .then(person => console.log(person.displayName))
  .catch(err => console.error(err));
```
<a name="Spark.personAdd"></a>

### Spark.personAdd(person) ⇒ [<code>Promise.&lt;Person&gt;</code>](#Person)
Add new Person.

**Kind**: static method of [<code>Spark</code>](#Spark)  
**Returns**: [<code>Promise.&lt;Person&gt;</code>](#Person) - Spark Person object  

| Param | Type | Description |
| --- | --- | --- |
| person | [<code>Object.&lt;Person&gt;</code>](#Person) | Spark Person object |

**Example**  
```js
let newPerson = {
  emails: ['aperson@company.com'],
  displayName: 'Any Person',
  firstName: 'Any',
  lastName: 'Person',
  avatar: 'http://lorempixel.com/400/400/',
  orgId: 'Tm90aGluZyB0byBzZWUgaGVy',
  roles: ['Tm90aGluZyB0byBzZWUgaGVy'],
  licenses: ['Tm90aGluZyB0byBzZWUgaGVy']
};

spark.personAdd(newPerson)
  .then(person => console.log(person.displayName))
  .catch(err => console.error(err));
```
<a name="Spark.personUpdate"></a>

### Spark.personUpdate(person) ⇒ [<code>Promise.&lt;Person&gt;</code>](#Person)
Update a Person.

**Kind**: static method of [<code>Spark</code>](#Spark)  
**Returns**: [<code>Promise.&lt;Person&gt;</code>](#Person) - Spark Person object  

| Param | Type | Description |
| --- | --- | --- |
| person | [<code>Object.&lt;Person&gt;</code>](#Person) | Spark Person object |

**Example**  
```js
spark.personGet('Tm90aGluZyB0byBzZWUgaGVy')
  .then((person) => {
    person.displayName = 'Another Person';
    return spark.personUpdate(person);
  })
  .then(person => console.log(person.displayName))
  .catch(err => console.error(err));
```
<a name="Spark.personRemove"></a>

### Spark.personRemove(personId) ⇒ <code>Promise</code>
Remove Spark Person by ID.

**Kind**: static method of [<code>Spark</code>](#Spark)  
**Returns**: <code>Promise</code> - Fulfilled promise  

| Param | Type | Description |
| --- | --- | --- |
| personId | <code>String</code> | Spark Person ID |

**Example**  
```js
spark.personRemove('Tm90aGluZyB0byBzZWUgaGVy')
  .then(() => console.log('Person removed.'))
  .catch(err => console.error(err));
```
<a name="Spark.rolesGet"></a>

### Spark.rolesGet([max]) ⇒ [<code>Promise.Array.&lt;Role&gt;</code>](#Role)
Returns all Spark Roles that the authenticated account is
in. If 'max' is not specifed, returns all.

**Kind**: static method of [<code>Spark</code>](#Spark)  
**Returns**: [<code>Promise.Array.&lt;Role&gt;</code>](#Role) - Array of Spark Role object  

| Param | Type | Description |
| --- | --- | --- |
| [max] | <code>Integer</code> | Number of records to return (optional) |

**Example**  
```js
spark.rolesGet(10)
  .then(roles => roles.forEach(role => console.log(role.name)))
  .catch(err => console.error(err));
```
<a name="Spark.roleGet"></a>

### Spark.roleGet(roleId) ⇒ [<code>Promise.&lt;Role&gt;</code>](#Role)
Returns details for a Spark Role pecified by Role ID.

**Kind**: static method of [<code>Spark</code>](#Spark)  
**Returns**: [<code>Promise.&lt;Role&gt;</code>](#Role) - Spark Role object  

| Param | Type | Description |
| --- | --- | --- |
| roleId | <code>String</code> | Spark Role ID |

**Example**  
```js
spark.roleGet('Tm90aGluZyB0byBzZWUgaGVy')
  .then(role => console.log(role.name))
  .catch(err => console.error(err));
```
<a name="Spark.roomsGet"></a>

### Spark.roomsGet([roomSearch], [max]) ⇒ [<code>Promise.Array.&lt;Room&gt;</code>](#Room)
Returns Spark Room Objects. If roomSearch argument is not
passed, returns all Spark Rooms that the authenticated account is in.
If 'max' is not specifed, returns all.

**Kind**: static method of [<code>Spark</code>](#Spark)  
**Returns**: [<code>Promise.Array.&lt;Room&gt;</code>](#Room) - Array of Spark Room objects  

| Param | Type | Description |
| --- | --- | --- |
| [roomSearch] | <code>Object.&lt;RoomSearch&gt;</code> | Spark Person Search Object (optional) |
| [max] | <code>Integer</code> | Number of records to return (optional) |

**Example**  
```js
spark.roomsGet({ type: 'group' }, 10)
  .then(rooms => rooms.forEach(room => console.log(room.title)))
  .catch(err => console.error(err));
```
<a name="Spark.roomGet"></a>

### Spark.roomGet(roomId) ⇒ [<code>Promise.&lt;Room&gt;</code>](#Room)
Returns a Spark Room Object specified by Room ID.

**Kind**: static method of [<code>Spark</code>](#Spark)  
**Returns**: [<code>Promise.&lt;Room&gt;</code>](#Room) - Spark Room object  

| Param | Type | Description |
| --- | --- | --- |
| roomId | <code>String</code> | Spark Room ID |

**Example**  
```js
spark.roomGet('Tm90aGluZyB0byBzZWUgaGVy')
  .then(room => console.log(room.title))
  .catch(err => console.error(err));
```
<a name="Spark.roomAdd"></a>

### Spark.roomAdd(title, [teamId]) ⇒ [<code>Promise.&lt;Room&gt;</code>](#Room)
Add new Spark Room.

**Kind**: static method of [<code>Spark</code>](#Spark)  
**Returns**: [<code>Promise.&lt;Room&gt;</code>](#Room) - Spark Room object  

| Param | Type | Description |
| --- | --- | --- |
| title | <code>String</code> | Title for a new Room |
| [teamId] | <code>String</code> | Team ID (optional) |

**Example**  
```js
spark.roomAdd('myroom')
  .then(room => console.log(room.title))
  .catch(err => console.error(err));
```
<a name="Spark.roomUpdate"></a>

### Spark.roomUpdate(room) ⇒ [<code>Promise.&lt;Room&gt;</code>](#Room)
Update a Spark Room.

**Kind**: static method of [<code>Spark</code>](#Spark)  
**Returns**: [<code>Promise.&lt;Room&gt;</code>](#Room) - Spark Room object  

| Param | Type | Description |
| --- | --- | --- |
| room | [<code>Object.&lt;Room&gt;</code>](#Room) | Spark Room object |

**Example**  
```js
spark.roomGet(Tm90aGluZyB0byBzZWUgaGVy)
  .then((room) => {
    room.title = 'Another Title';
    return spark.roomUpdate(room);
  )
  .then(room => console.log(room.title))
  .catch(err => console.error(err));
```
<a name="Spark.roomRemove"></a>

### Spark.roomRemove(roomId) ⇒ <code>Promise</code>
Remove Spark Room by ID.

**Kind**: static method of [<code>Spark</code>](#Spark)  
**Returns**: <code>Promise</code> - Fulfilled promise  

| Param | Type | Description |
| --- | --- | --- |
| roomId | <code>String</code> | Spark Room ID |

**Example**  
```js
spark.roomRemove('Tm90aGluZyB0byBzZWUgaGVy')
  .then(() => console.log('Room removed.'))
  .catch(err => console.error(err));
```
<a name="Spark.teamsGet"></a>

### Spark.teamsGet([max]) ⇒ [<code>Promise.Array.&lt;Team&gt;</code>](#Team)
Return all Spark Teams that the authenticated account is in.
If 'max' is not specifed, returns all.

**Kind**: static method of [<code>Spark</code>](#Spark)  
**Returns**: [<code>Promise.Array.&lt;Team&gt;</code>](#Team) - Teams Collection  

| Param | Type | Description |
| --- | --- | --- |
| [max] | <code>Integer</code> | Number of records to return (optional) |

**Example**  
```js
spark.teamsGet(10)
  .then(teams => teams.forEach(team => console.log(team.name)))
  .catch(err => console.error(err));
```
<a name="Spark.teamGet"></a>

### Spark.teamGet(teamId) ⇒ [<code>Promise.&lt;Team&gt;</code>](#Team)
Returns a Spark Team Object specified by Team ID.

**Kind**: static method of [<code>Spark</code>](#Spark)  
**Returns**: [<code>Promise.&lt;Team&gt;</code>](#Team) - Team  

| Param | Type | Description |
| --- | --- | --- |
| teamId | <code>String</code> | Spark Team ID |

**Example**  
```js
spark.teamGet('Tm90aGluZyB0byBzZWUgaGVy')
  .then(team => console.log(team.name))
  .catch(err => console.error(err));
```
<a name="Spark.teamAdd"></a>

### Spark.teamAdd(name) ⇒ [<code>Promise.&lt;Team&gt;</code>](#Team)
Add new Spark Team.

**Kind**: static method of [<code>Spark</code>](#Spark)  
**Returns**: [<code>Promise.&lt;Team&gt;</code>](#Team) - Team  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>String</code> | Name for new Team |

**Example**  
```js
spark.teamAdd('myteam')
  .then(team => console.log(team.name))
  .catch(err => console.error(err));
```
<a name="Spark.teamUpdate"></a>

### Spark.teamUpdate(team) ⇒ [<code>Promise.&lt;Team&gt;</code>](#Team)
Update a Team.

**Kind**: static method of [<code>Spark</code>](#Spark)  
**Returns**: [<code>Promise.&lt;Team&gt;</code>](#Team) - Team  

| Param | Type | Description |
| --- | --- | --- |
| team | [<code>Object.&lt;Team&gt;</code>](#Team) | Spark Team Object |

**Example**  
```js
spark.teamGet('Tm90aGluZyB0byBzZWUgaGVy')
  .then((team) => {
    team.name = 'Another Team';
    return spark.teamUpdate(team);
  })
  .then(team => console.log(team.name))
  .catch(err => console.error(err));
```
<a name="Spark.teamRemove"></a>

### Spark.teamRemove(teamId) ⇒ <code>Promise</code>
Remove Spark Team by ID.

**Kind**: static method of [<code>Spark</code>](#Spark)  
**Returns**: <code>Promise</code> - Fulfilled promise  

| Param | Type | Description |
| --- | --- | --- |
| teamId | <code>String</code> | Spark Team ID |

**Example**  
```js
spark.teamRemove('Tm90aGluZyB0byBzZWUgaGVy')
  .then(() => console.log('Team removed.'))
  .catch(err => console.error(err));
```
<a name="Spark.teamMembershipsGet"></a>

### Spark.teamMembershipsGet(teamId, [max]) ⇒ [<code>Promise.Array.&lt;TeamMembership&gt;</code>](#TeamMembership)
Return all Spark Team Memberships for a specific Team that
the authenticated account is in. If 'max' is not specifed, returns all.

**Kind**: static method of [<code>Spark</code>](#Spark)  
**Returns**: [<code>Promise.Array.&lt;TeamMembership&gt;</code>](#TeamMembership) - Array of Spark TeamMembership objects  

| Param | Type | Description |
| --- | --- | --- |
| teamId | <code>String</code> | Spark Team Memebership ID |
| [max] | <code>Integer</code> | Number of records to return |

**Example**  
```js
spark.teamMembershipsGet('Tm90aGluZyB0byBzZWUgaGVy', 100)
  .then(tms => tms.forEach(tm => console.log(tm.personEmail)))
  .catch(err => console.error(err));
```
<a name="Spark.teamMembershipGet"></a>

### Spark.teamMembershipGet(membershipId) ⇒ [<code>Promise.&lt;TeamMembership&gt;</code>](#TeamMembership)
Return Spark Team Membership specified by Membership ID.

**Kind**: static method of [<code>Spark</code>](#Spark)  
**Returns**: [<code>Promise.&lt;TeamMembership&gt;</code>](#TeamMembership) - Spark TeamMembership object  

| Param | Type | Description |
| --- | --- | --- |
| membershipId | <code>String</code> | Spark Membership ID |

**Example**  
```js
spark.membershipGet('Tm90aGluZyB0byBzZWUgaGVy')
  .then(tm => console.log(tm.personEmail))
  .catch(err => console.error(err));
```
<a name="Spark.teamMembershipAdd"></a>

### Spark.teamMembershipAdd(teamId, personEmail, isModerator) ⇒ [<code>Promise.&lt;TeamMembership&gt;</code>](#TeamMembership)
Add new Spark Team Membership.

**Kind**: static method of [<code>Spark</code>](#Spark)  
**Returns**: [<code>Promise.&lt;TeamMembership&gt;</code>](#TeamMembership) - Spark TeamMembership object  

| Param | Type | Description |
| --- | --- | --- |
| teamId | <code>String</code> | Spark Team Memebership ID |
| personEmail | <code>String</code> | Email address of person to add |
| isModerator | <code>Boolean</code> | Boolean value to add as moderator |

**Example**  
```js
spark.teamMembershipAdd('Tm90aGluZyB0byBzZWUgaGVy', 'aperson@company.com')
  .then(tm => console.log(tm.personEmail))
  .catch(err => console.error(err));
```
**Example**  
```js
const teamMembershipObj = {
  personEmail: 'test@test.com',
  teamId: 'Tm90aGluZyB0byBzZWUgaGVy',
  isModerator: true,
};
spark.teamMembershipAdd(teamMembershipObj)
  .then(tm => console.log(tm.personEmail))
  .catch(err => console.error(err));
```
<a name="Spark.teamMembershipUpdate"></a>

### Spark.teamMembershipUpdate(teamMembership) ⇒ [<code>Promise.&lt;TeamMembership&gt;</code>](#TeamMembership)
Update a Team Membership.

**Kind**: static method of [<code>Spark</code>](#Spark)  
**Returns**: [<code>Promise.&lt;TeamMembership&gt;</code>](#TeamMembership) - Spark TeamMembership object  

| Param | Type | Description |
| --- | --- | --- |
| teamMembership | [<code>object.&lt;TeamMembership&gt;</code>](#TeamMembership) | Spark TeamMembership object |

**Example**  
```js
spark.teamMembershipGet('Tm90aGluZyB0byBzZWUgaGVy')
  .then((tm) => {
    tm.isModerator = true;
    return spark.teamMembershipUpdate(tm);
  )
  .then(tm => console.log(tm.isModerator))
  .catch(err => console.error(err));
```
<a name="Spark.teamMembershipRemove"></a>

### Spark.teamMembershipRemove(membershipId) ⇒ <code>Promise</code>
Remove Spark Team Membership by ID..

**Kind**: static method of [<code>Spark</code>](#Spark)  
**Returns**: <code>Promise</code> - Fulfilled promise  

| Param | Type | Description |
| --- | --- | --- |
| membershipId | <code>String</code> | Spark Team Membership ID |

**Example**  
```js
spark.teamMembershipRemove('Tm90aGluZyB0byBzZWUgaGVy')
  .then(() => console.log('Team Membership removed.'))
  .catch(err => console.error(err));
```
<a name="Spark.webhooksGet"></a>

### Spark.webhooksGet([max]) ⇒ [<code>Promise.Array.&lt;Webhook&gt;</code>](#Webhook)
Return all Spark Webhooks that the authenticated account is
in. If 'max' is not specifed, returns all.

**Kind**: static method of [<code>Spark</code>](#Spark)  
**Returns**: [<code>Promise.Array.&lt;Webhook&gt;</code>](#Webhook) - Array of Spark Webhook objects  

| Param | Type | Description |
| --- | --- | --- |
| [max] | <code>Integer</code> | Number of records to return |

**Example**  
```js
spark.webhooksGet(10)
  .then(webhooks => webhooks.forEach(webhook => console.log(webhook.name)))
  .catch(err => console.error(err));
```
<a name="Spark.webhooksSearch"></a>

### Spark.webhooksSearch(webhookSearch, [max]) ⇒ [<code>Promise.Array.&lt;Webhook&gt;</code>](#Webhook)
Returns all webhooks that match the search criteria

**Kind**: static method of [<code>Spark</code>](#Spark)  
**Returns**: [<code>Promise.Array.&lt;Webhook&gt;</code>](#Webhook) - Array of Spark Webhook objects  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| webhookSearch | <code>Object</code> |  | Webhook Search object |
| [max] | <code>Integer</code> | <code>10</code> | Number of records to return |

**Example**  
```js
spark.webhooksSearch({ name: 'My Awesome Webhook' })
  .then(webhooks => webhooks.forEach(webhook => console.log(webhook.name)))
  .catch(err => console.error(err));
```
<a name="Spark.webhookGet"></a>

### Spark.webhookGet(webhookId) ⇒ [<code>Promise.&lt;Webhook&gt;</code>](#Webhook)
Returns details of Spark Webhook Object specified by Webhook ID.

**Kind**: static method of [<code>Spark</code>](#Spark)  
**Returns**: [<code>Promise.&lt;Webhook&gt;</code>](#Webhook) - Spark Webhook object  

| Param | Type | Description |
| --- | --- | --- |
| webhookId | <code>String</code> | Spark Webhook ID |

**Example**  
```js
spark.webhookGet('Tm90aGluZyB0byBzZWUgaGVy')
  .then(webhook => console.log(webhook.name))
  .catch(err => console.error(err));
```
<a name="Spark.webhookAdd"></a>

### Spark.webhookAdd(webhookObj) ⇒ [<code>Promise.&lt;Webhook&gt;</code>](#Webhook)
Add new Webhook.

**Kind**: static method of [<code>Spark</code>](#Spark)  
**Returns**: [<code>Promise.&lt;Webhook&gt;</code>](#Webhook) - Spark Webhook object  

| Param | Type | Description |
| --- | --- | --- |
| webhookObj | [<code>Object.&lt;Webhook&gt;</code>](#Webhook) | Spark Webhook object |

**Example**  
```js
const newWebhook = {
  name: 'my webhook',
  targetUrl: 'https://example.com/webhook',
  resource: 'memberships',
  event: 'created',
  filter: 'roomId=Tm90aGluZyB0byBzZWUgaGVy'
};

spark.webhookAdd(newWebhook)
  .then(webhook => console.log(webhook.name))
  .catch(err => console.error(err));
```
<a name="Spark.webhookUpdate"></a>

### Spark.webhookUpdate(webhookObj) ⇒ [<code>Promise.&lt;Webhook&gt;</code>](#Webhook)
Update a Webhook.

**Kind**: static method of [<code>Spark</code>](#Spark)  
**Returns**: [<code>Promise.&lt;Webhook&gt;</code>](#Webhook) - Spark Webhook Object  

| Param | Type | Description |
| --- | --- | --- |
| webhookObj | [<code>Object.&lt;Webhook&gt;</code>](#Webhook) | Spark Webhook Object |

**Example**  
```js
spark.webhookGet(Tm90aGluZyB0byBzZWUgaGVy)
  .then((webhook) => {
    webhook.name = 'Another Webhook';
    return spark.webhookUpdate(webhook);
  })
  .then(webhook => console.log(webhook.name))
  .catch(err => console.error(err));
```
<a name="Spark.webhookRemove"></a>

### Spark.webhookRemove(webhookId) ⇒ <code>Promise</code>
Remove Spark Webhook by ID.

**Kind**: static method of [<code>Spark</code>](#Spark)  
**Returns**: <code>Promise</code> - Fulfilled promise  

| Param | Type | Description |
| --- | --- | --- |
| webhookId | <code>String</code> | Spark Webhook ID. |

**Example**  
```js
spark.webhookRemove('Tm90aGluZyB0byBzZWUgaGVy')
  .then(() => console.log('Webhook removed.'))
  .catch(err => console.error(err));
```
<a name="Spark.webhookAuth"></a>

### Spark.webhookAuth(secret, signature, payload) ⇒ <code>Promise.String</code> \| <code>Object</code>
Authenticate X-Spark-Signature HMAC-SHA1 Hash.

**Kind**: static method of [<code>Spark</code>](#Spark)  
**Returns**: <code>Promise.String</code> \| <code>Object</code> - payload  

| Param | Type | Description |
| --- | --- | --- |
| secret | <code>String</code> | Value of secret used when creating webhook |
| signature | <code>String</code> | Value of "X-Spark-Signature" from header |
| payload | <code>String</code> \| <code>Object</code> | This can either be the json object or a string representation of the webhook's body json payload |

**Example**  
```js
const sig = req.headers['x-spark-signature'];
const secret = 'mySecret';

spark.webhookAuth(secret, sig, req.body)
  .then(() => console.log('Webhook is valid');
  .catch(err => console.error(err));
```
<a name="Spark.webhookListen"></a>

### Spark.webhookListen() ⇒ [<code>webhookHandler</code>](#Spark.webhookListen..webhookHandler)
Process request from connect, express, or resitify routes.
Returns function that accepts req, res, and next arguments.

**Kind**: static method of [<code>Spark</code>](#Spark)  
**Returns**: [<code>webhookHandler</code>](#Spark.webhookListen..webhookHandler) - function  
**Example**  
```js
const Spark = require('node-sparky');
const express = require('express');
const bodyParser = require('body-parser');

const spark = new Spark({
  token: '<my token>',
  webhookSecret: 'somesecr3t',
});

// add events
spark.on('messages-created', msg => console.log(`${msg.personEmail} said: ${msg.text}`));

const app = express();
app.use(bodyParser.json());

// add route for path that is listening for web hooks
app.post('/webhook', spark.webhookListen());

// start express server
const server = app.listen('3000', function() {
  // create spark webhook directed back to express route defined above
  spark.webhookAdd({
    name: 'my webhook',
    targetUrl: 'https://example.com/webhook',
    resource: 'all',
    event: 'all'
  });
  console.log('Listening on port %s', '3000');
});
```
<a name="Spark.webhookListen..webhookHandler"></a>

#### webhookListen~webhookHandler(req, [res], [next]) ⇒ <code>Null</code>
Function returned by spark.webhookListen()

**Kind**: inner method of [<code>webhookListen</code>](#Spark.webhookListen)  
**Returns**: <code>Null</code> - null value  

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
| created | <code>String</code> | Date Membership created (ISO 8601) |

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
| created | <code>String</code> | Date Message created (ISO 8601) |
| mentionedPeople | <code>Array.String</code> | Person IDs of those mentioned in Message |

<a name="Organization"></a>

## Organization : <code>object</code>
Organization Object

**Kind**: global namespace  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| id | <code>String</code> | Organization ID |
| displayName | <code>String</code> | Organization name |
| created | <code>String</code> | Date Organization created (ISO 8601) |

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
| created | <code>String</code> | Date created (ISO 8601) |

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
| lastActivity | <code>String</code> | Last Activity in Room (ISO 8601) |
| creatorId | <code>String</code> | person ID of Room creator (ISO 8601) |
| created | <code>String</code> | Room Created (ISO 8601) |

<a name="Team"></a>

## Team : <code>object</code>
Team Object

**Kind**: global namespace  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| id | <code>String</code> | Message ID |
| name | <code>String</code> | Team name |
| created | <code>String</code> | Date Team created (ISO 8601) |

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
| isModerator | <code>Boolean</code> | Membership is a moderator |
| created | <code>String</code> | Date Membership created (ISO 8601) |

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
| created | <code>String</code> | Date Webhook created (ISO 8601) |

<a name="Validator"></a>

## Validator : <code>object</code>
Spark Object Validation

**Kind**: global namespace  

* [Validator](#Validator) : <code>object</code>
    * [.isFile(filePath)](#Validator.isFile) ⇒ <code>Promise.String</code>
    * [.isDir(dirPath)](#Validator.isDir) ⇒ <code>Promise.String</code>
    * [.isToken(token)](#Validator.isToken) ⇒ <code>Promise.String</code>
    * [.isEmail(email)](#Validator.isEmail) ⇒ <code>Boolean</code>
    * [.isEmails(emails)](#Validator.isEmails) ⇒ <code>Boolean</code>
    * [.isUrl(url)](#Validator.isUrl) ⇒ <code>Boolean</code>
    * [.isFilePath(path)](#Validator.isFilePath) ⇒ <code>Boolean</code>
    * [.isOptions(options)](#Validator.isOptions) ⇒ <code>Boolean</code>
    * [.isFile(file)](#Validator.isFile) ⇒ <code>Boolean</code>
    * [.isLicense(license)](#Validator.isLicense) ⇒ <code>Boolean</code>
    * [.isLicenses(licenses)](#Validator.isLicenses) ⇒ <code>Boolean</code>
    * [.isLicenseSearch(searchObj)](#Validator.isLicenseSearch) ⇒ <code>Boolean</code>
    * [.isMembership(membership)](#Validator.isMembership) ⇒ <code>Boolean</code>
    * [.isMemberships(memberships)](#Validator.isMemberships) ⇒ <code>Boolean</code>
    * [.isMembershipSearch(searchObj)](#Validator.isMembershipSearch) ⇒ <code>Boolean</code>
    * [.isMessage(message)](#Validator.isMessage) ⇒ <code>Boolean</code>
    * [.isMessages(messages)](#Validator.isMessages) ⇒ <code>Boolean</code>
    * [.isMessageSearch(searchObj)](#Validator.isMessageSearch) ⇒ <code>Boolean</code>
    * [.isOrganization(organization)](#Validator.isOrganization) ⇒ <code>Boolean</code>
    * [.isOrganizations(organizations)](#Validator.isOrganizations) ⇒ <code>Boolean</code>
    * [.isPerson(person)](#Validator.isPerson) ⇒ <code>Boolean</code>
    * [.isPeople(people)](#Validator.isPeople) ⇒ <code>Boolean</code>
    * [.isPersonSearch(searchObj)](#Validator.isPersonSearch) ⇒ <code>Boolean</code>
    * [.isRole(role)](#Validator.isRole) ⇒ <code>Boolean</code>
    * [.isRoles(roles)](#Validator.isRoles) ⇒ <code>Boolean</code>
    * [.isRoom(room)](#Validator.isRoom) ⇒ <code>Boolean</code>
    * [.isRooms(rooms)](#Validator.isRooms) ⇒ <code>Boolean</code>
    * [.isRoomSearch(searchObj)](#Validator.isRoomSearch) ⇒ <code>Boolean</code>
    * [.isTeam(team)](#Validator.isTeam) ⇒ <code>Boolean</code>
    * [.isTeams(teams)](#Validator.isTeams) ⇒ <code>Boolean</code>
    * [.isTeamMembership(teamMembership)](#Validator.isTeamMembership) ⇒ <code>Boolean</code>
    * [.isTeamMemberships(teamMemberships)](#Validator.isTeamMemberships) ⇒ <code>Boolean</code>
    * [.isTeamMembershipSearch(searchObj)](#Validator.isTeamMembershipSearch) ⇒ <code>Boolean</code>
    * [.isWebhook(webhook)](#Validator.isWebhook) ⇒ <code>Boolean</code>
    * [.isWebhooks(webhooks)](#Validator.isWebhooks) ⇒ <code>Boolean</code>

<a name="Validator.isFile"></a>

### Validator.isFile(filePath) ⇒ <code>Promise.String</code>
Validate filePath resolves to existing file. Returns fulfilled Promise with
filePath if valid, else returns rejected Promise if not valid.

**Kind**: static method of [<code>Validator</code>](#Validator)  
**Returns**: <code>Promise.String</code> - Absolute path to file  

| Param | Type | Description |
| --- | --- | --- |
| filePath | <code>String</code> | Absolute path to file |

<a name="Validator.isDir"></a>

### Validator.isDir(dirPath) ⇒ <code>Promise.String</code>
Validate filePath resolves to existing dir. Returns fulfilled Promise with
dirPath if valid, else returns rejected Promise if not valid.

**Kind**: static method of [<code>Validator</code>](#Validator)  
**Returns**: <code>Promise.String</code> - Absolute path to a directory  

| Param | Type | Description |
| --- | --- | --- |
| dirPath | <code>String</code> | Absolute path to a directory |

<a name="Validator.isToken"></a>

### Validator.isToken(token) ⇒ <code>Promise.String</code>
Validate Spark Token is valid by sending request to API to determine if
authorized. Returns fulfilled Promise with token if valid, else returns rejected
Promise if not valid.

**Kind**: static method of [<code>Validator</code>](#Validator)  
**Returns**: <code>Promise.String</code> - Cisco Spark Token  

| Param | Type | Description |
| --- | --- | --- |
| token | <code>String</code> | Cisco Spark Token |

<a name="Validator.isEmail"></a>

### Validator.isEmail(email) ⇒ <code>Boolean</code>
Validate String is Email.

**Kind**: static method of [<code>Validator</code>](#Validator)  
**Returns**: <code>Boolean</code> - result  

| Param | Type | Description |
| --- | --- | --- |
| email | <code>String</code> | Email address string |

<a name="Validator.isEmails"></a>

### Validator.isEmails(emails) ⇒ <code>Boolean</code>
Validate Emails in Array.

**Kind**: static method of [<code>Validator</code>](#Validator)  
**Returns**: <code>Boolean</code> - result  

| Param | Type | Description |
| --- | --- | --- |
| emails | <code>Array</code> | Array of Email address string |

<a name="Validator.isUrl"></a>

### Validator.isUrl(url) ⇒ <code>Boolean</code>
Validate String is URL.

**Kind**: static method of [<code>Validator</code>](#Validator)  
**Returns**: <code>Boolean</code> - result  

| Param | Type | Description |
| --- | --- | --- |
| url | <code>String</code> | URL String |

<a name="Validator.isFilePath"></a>

### Validator.isFilePath(path) ⇒ <code>Boolean</code>
Validate String is File path and not a URL/URI.

**Kind**: static method of [<code>Validator</code>](#Validator)  
**Returns**: <code>Boolean</code> - result  

| Param | Type | Description |
| --- | --- | --- |
| path | <code>String</code> | String to test |

<a name="Validator.isOptions"></a>

### Validator.isOptions(options) ⇒ <code>Boolean</code>
Validate Options object

**Kind**: static method of [<code>Validator</code>](#Validator)  
**Returns**: <code>Boolean</code> - result  

| Param | Type | Description |
| --- | --- | --- |
| options | <code>Object.&lt;Options&gt;</code> | Validate that object passed includes all valid options for sparky constructor |

<a name="Validator.isFile"></a>

### Validator.isFile(file) ⇒ <code>Boolean</code>
Validate File object

**Kind**: static method of [<code>Validator</code>](#Validator)  
**Returns**: <code>Boolean</code> - result  

| Param | Type | Description |
| --- | --- | --- |
| file | [<code>Object.&lt;File&gt;</code>](#File) | Validate that object passed includes all valid options required in a file object |

<a name="Validator.isLicense"></a>

### Validator.isLicense(license) ⇒ <code>Boolean</code>
Validate Spark License Object.

**Kind**: static method of [<code>Validator</code>](#Validator)  
**Returns**: <code>Boolean</code> - result  

| Param | Type | Description |
| --- | --- | --- |
| license | [<code>License</code>](#License) | License object |

<a name="Validator.isLicenses"></a>

### Validator.isLicenses(licenses) ⇒ <code>Boolean</code>
Validate Spark License Objects in Array.

**Kind**: static method of [<code>Validator</code>](#Validator)  
**Returns**: <code>Boolean</code> - result  

| Param | Type | Description |
| --- | --- | --- |
| licenses | <code>Array</code> | Array of License objects |

<a name="Validator.isLicenseSearch"></a>

### Validator.isLicenseSearch(searchObj) ⇒ <code>Boolean</code>
Validate Spark License Search Object.

**Kind**: static method of [<code>Validator</code>](#Validator)  
**Returns**: <code>Boolean</code> - result  

| Param | Type | Description |
| --- | --- | --- |
| searchObj | <code>LicenseSearch</code> | LicenseSearch object |

<a name="Validator.isMembership"></a>

### Validator.isMembership(membership) ⇒ <code>Boolean</code>
Validate Spark Membership Object.

**Kind**: static method of [<code>Validator</code>](#Validator)  
**Returns**: <code>Boolean</code> - result  

| Param | Type | Description |
| --- | --- | --- |
| membership | [<code>Membership</code>](#Membership) | Membership object |

<a name="Validator.isMemberships"></a>

### Validator.isMemberships(memberships) ⇒ <code>Boolean</code>
Validate Spark Membership Objects in Array.

**Kind**: static method of [<code>Validator</code>](#Validator)  
**Returns**: <code>Boolean</code> - result  

| Param | Type | Description |
| --- | --- | --- |
| memberships | <code>Array</code> | Array of Membership objects |

<a name="Validator.isMembershipSearch"></a>

### Validator.isMembershipSearch(searchObj) ⇒ <code>Boolean</code>
Validate Spark Membership Search Object.

**Kind**: static method of [<code>Validator</code>](#Validator)  
**Returns**: <code>Boolean</code> - result  

| Param | Type | Description |
| --- | --- | --- |
| searchObj | <code>MembershipSearch</code> | MembershipSearch object |

<a name="Validator.isMessage"></a>

### Validator.isMessage(message) ⇒ <code>Boolean</code>
Validate Spark Message Object.

**Kind**: static method of [<code>Validator</code>](#Validator)  
**Returns**: <code>Boolean</code> - result  

| Param | Type | Description |
| --- | --- | --- |
| message | [<code>Message</code>](#Message) | Message object |

<a name="Validator.isMessages"></a>

### Validator.isMessages(messages) ⇒ <code>Boolean</code>
Validate Spark Message Objects in Array.

**Kind**: static method of [<code>Validator</code>](#Validator)  
**Returns**: <code>Boolean</code> - result  

| Param | Type | Description |
| --- | --- | --- |
| messages | <code>Array</code> | Array of Message objects |

<a name="Validator.isMessageSearch"></a>

### Validator.isMessageSearch(searchObj) ⇒ <code>Boolean</code>
Validate Spark Message Search Object.

**Kind**: static method of [<code>Validator</code>](#Validator)  
**Returns**: <code>Boolean</code> - result  

| Param | Type | Description |
| --- | --- | --- |
| searchObj | <code>MessageSearch</code> | MessageSearch object |

<a name="Validator.isOrganization"></a>

### Validator.isOrganization(organization) ⇒ <code>Boolean</code>
Validate Spark Organization Object.

**Kind**: static method of [<code>Validator</code>](#Validator)  
**Returns**: <code>Boolean</code> - result  

| Param | Type | Description |
| --- | --- | --- |
| organization | [<code>Organization</code>](#Organization) | Organization object |

<a name="Validator.isOrganizations"></a>

### Validator.isOrganizations(organizations) ⇒ <code>Boolean</code>
Validate Spark Organizations Objects in Array.

**Kind**: static method of [<code>Validator</code>](#Validator)  
**Returns**: <code>Boolean</code> - result  

| Param | Type | Description |
| --- | --- | --- |
| organizations | <code>Array</code> | Array of Organization objects |

<a name="Validator.isPerson"></a>

### Validator.isPerson(person) ⇒ <code>Boolean</code>
Validate Spark Person Object.

**Kind**: static method of [<code>Validator</code>](#Validator)  
**Returns**: <code>Boolean</code> - result  

| Param | Type | Description |
| --- | --- | --- |
| person | [<code>Person</code>](#Person) | Person object |

<a name="Validator.isPeople"></a>

### Validator.isPeople(people) ⇒ <code>Boolean</code>
Validate Spark Person Objects in Array.

**Kind**: static method of [<code>Validator</code>](#Validator)  
**Returns**: <code>Boolean</code> - result  

| Param | Type | Description |
| --- | --- | --- |
| people | <code>Array</code> | Array of Person objects |

<a name="Validator.isPersonSearch"></a>

### Validator.isPersonSearch(searchObj) ⇒ <code>Boolean</code>
Validate Spark Person Search Object.

**Kind**: static method of [<code>Validator</code>](#Validator)  
**Returns**: <code>Boolean</code> - result  

| Param | Type | Description |
| --- | --- | --- |
| searchObj | <code>PersonSearch</code> | Person Search object |

<a name="Validator.isRole"></a>

### Validator.isRole(role) ⇒ <code>Boolean</code>
Validate Spark Role Object.

**Kind**: static method of [<code>Validator</code>](#Validator)  
**Returns**: <code>Boolean</code> - result  

| Param | Type | Description |
| --- | --- | --- |
| role | [<code>Role</code>](#Role) | Role object |

<a name="Validator.isRoles"></a>

### Validator.isRoles(roles) ⇒ <code>Boolean</code>
Validate Spark Role Objects in Array.

**Kind**: static method of [<code>Validator</code>](#Validator)  
**Returns**: <code>Boolean</code> - result  

| Param | Type | Description |
| --- | --- | --- |
| roles | <code>Array</code> | Array of Role objects |

<a name="Validator.isRoom"></a>

### Validator.isRoom(room) ⇒ <code>Boolean</code>
Validate Spark Room Object.

**Kind**: static method of [<code>Validator</code>](#Validator)  
**Returns**: <code>Boolean</code> - result  

| Param | Type | Description |
| --- | --- | --- |
| room | [<code>Room</code>](#Room) | Room Object |

<a name="Validator.isRooms"></a>

### Validator.isRooms(rooms) ⇒ <code>Boolean</code>
Validate Spark Room Objects in Array.

**Kind**: static method of [<code>Validator</code>](#Validator)  
**Returns**: <code>Boolean</code> - result  

| Param | Type | Description |
| --- | --- | --- |
| rooms | <code>Array</code> | Array of Room objects |

<a name="Validator.isRoomSearch"></a>

### Validator.isRoomSearch(searchObj) ⇒ <code>Boolean</code>
Validate Spark Room Search Object.

**Kind**: static method of [<code>Validator</code>](#Validator)  
**Returns**: <code>Boolean</code> - result  

| Param | Type | Description |
| --- | --- | --- |
| searchObj | <code>RoomSearch</code> | RoomSearch object |

<a name="Validator.isTeam"></a>

### Validator.isTeam(team) ⇒ <code>Boolean</code>
Validate Spark Team Object.

**Kind**: static method of [<code>Validator</code>](#Validator)  
**Returns**: <code>Boolean</code> - result  

| Param | Type | Description |
| --- | --- | --- |
| team | [<code>Team</code>](#Team) | Team object |

<a name="Validator.isTeams"></a>

### Validator.isTeams(teams) ⇒ <code>Boolean</code>
Validate Spark Team Objects in Array.

**Kind**: static method of [<code>Validator</code>](#Validator)  
**Returns**: <code>Boolean</code> - result  

| Param | Type | Description |
| --- | --- | --- |
| teams | <code>Array</code> | Array of Team objects |

<a name="Validator.isTeamMembership"></a>

### Validator.isTeamMembership(teamMembership) ⇒ <code>Boolean</code>
Validate Spark Team Membership Object.

**Kind**: static method of [<code>Validator</code>](#Validator)  
**Returns**: <code>Boolean</code> - result  

| Param | Type | Description |
| --- | --- | --- |
| teamMembership | [<code>TeamMembership</code>](#TeamMembership) | TeamMembership object |

<a name="Validator.isTeamMemberships"></a>

### Validator.isTeamMemberships(teamMemberships) ⇒ <code>Boolean</code>
Validate Spark Team Membership Objects in Array.

**Kind**: static method of [<code>Validator</code>](#Validator)  
**Returns**: <code>Boolean</code> - result  

| Param | Type | Description |
| --- | --- | --- |
| teamMemberships | <code>Array</code> | Array of TeamMembership objects |

<a name="Validator.isTeamMembershipSearch"></a>

### Validator.isTeamMembershipSearch(searchObj) ⇒ <code>Boolean</code>
Validate Spark Team Memebership Search Object.

**Kind**: static method of [<code>Validator</code>](#Validator)  
**Returns**: <code>Boolean</code> - result  

| Param | Type | Description |
| --- | --- | --- |
| searchObj | <code>TeamMembershipSearch</code> | TeamMembership object |

<a name="Validator.isWebhook"></a>

### Validator.isWebhook(webhook) ⇒ <code>Boolean</code>
Validate Spark Webhook Object.

**Kind**: static method of [<code>Validator</code>](#Validator)  
**Returns**: <code>Boolean</code> - result  

| Param | Type | Description |
| --- | --- | --- |
| webhook | [<code>Webhook</code>](#Webhook) | Webhook object |

<a name="Validator.isWebhooks"></a>

### Validator.isWebhooks(webhooks) ⇒ <code>Boolean</code>
Validate Spark Webhook Objects in Array.

**Kind**: static method of [<code>Validator</code>](#Validator)  
**Returns**: <code>Boolean</code> - result  

| Param | Type | Description |
| --- | --- | --- |
| webhooks | <code>Array</code> | Array of Webhook objects |

<a name="event_memberships"></a>

## "memberships"
Webhook membership event

**Kind**: event emitted  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| event | <code>String</code> | Triggered event (created, updated, deleted) |
| membership | [<code>Object.&lt;Membership&gt;</code>](#Membership) | Membership Object found in Webhook |
| reqBody | <code>Object.&lt;RequestBody&gt;</code> | Full Webhook Body Object |

<a name="event_messages"></a>

## "messages"
Webhook messages event

**Kind**: event emitted  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| event | <code>String</code> | Triggered event (created, deleted) |
| message | [<code>Object.&lt;Message&gt;</code>](#Message) | Message Object found in Webhook |
| reqBody | <code>Object.&lt;RequestBody&gt;</code> | Full Webhook Body Object |

<a name="event_rooms"></a>

## "rooms"
Webhook rooms event

**Kind**: event emitted  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| event | <code>String</code> | Triggered event (created, updated) |
| room | [<code>Object.&lt;Room&gt;</code>](#Room) | Room Object found in Webhook |
| reqBody | <code>Object.&lt;RequestBody&gt;</code> | Full Webhook Body Object |

<a name="event_memberships-created"></a>

## "memberships-created"
Webhook Memberships Created event

**Kind**: event emitted  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| membership | [<code>Object.&lt;Membership&gt;</code>](#Membership) | Membership Object found in Webhook |
| reqBody | <code>Object.&lt;RequestBody&gt;</code> | Full Webhook Body Object |

<a name="event_memberships-updated"></a>

## "memberships-updated"
Webhook Memberships Updated event

**Kind**: event emitted  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| membership | [<code>Object.&lt;Membership&gt;</code>](#Membership) | Membership Object found in Webhook |
| reqBody | <code>Object.&lt;RequestBody&gt;</code> | Full Webhook Body Object |

<a name="event_memberships-deleted"></a>

## "memberships-deleted"
Webhook Memberships Deleted event

**Kind**: event emitted  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| membership | [<code>Object.&lt;Membership&gt;</code>](#Membership) | Membership Object found in Webhook |
| reqBody | <code>Object.&lt;RequestBody&gt;</code> | Full Webhook Body Object |

<a name="event_messages-created"></a>

## "messages-created"
Webhook Messages Created event

**Kind**: event emitted  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| message | [<code>Object.&lt;Message&gt;</code>](#Message) | Message Object found in Webhook |
| reqBody | <code>Object.&lt;RequestBody&gt;</code> | Full Webhook Body Object |

<a name="event_messages-deleted"></a>

## "messages-deleted"
Webhook Messages Deleted event

**Kind**: event emitted  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| message | [<code>Object.&lt;Message&gt;</code>](#Message) | Message Object found in Webhook |
| reqBody | <code>Object.&lt;RequestBody&gt;</code> | Full Webhook Body Object |

<a name="event_rooms-created"></a>

## "rooms-created"
Webhook Rooms Created event

**Kind**: event emitted  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| message | [<code>Object.&lt;Room&gt;</code>](#Room) | Room Object found in Webhook |
| reqBody | <code>Object.&lt;RequestBody&gt;</code> | Full Webhook Body Object |

<a name="event_rooms-updated"></a>

## "rooms-updated"
Webhook Rooms Updated event

**Kind**: event emitted  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| message | [<code>Object.&lt;Room&gt;</code>](#Room) | Room Object found in Webhook |
| reqBody | <code>Object.&lt;RequestBody&gt;</code> | Full Webhook Body Object |

<a name="event_request"></a>

## "request"
Webhook request event

**Kind**: event emitted  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| reqBody | <code>Object.&lt;RequestBody&gt;</code> | Full Webhook Body Object |

## License

The MIT License (MIT)

Copyright (c) 2016-2018

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
