# node-sparky

[![NPM](https://nodei.co/npm/node-sparky.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/node-sparky/)

#### Cisco Spark API for Node JS

This is a Cisco Spark API Library for Node JS. This project aims to simplify interaction with the Spark API while transparently handling more complex operations such as pagination, webhook creation, and webhook authentication. If you have a question, feature request, or have found a bug, please open an issue.

#### Quick Start

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

## Using node-sparky as a Node JS Package

This module can be installed via NPM:

```bash
npm install node-sparky --save
```

## Using node-sparky webhook event parser in an Express App

```js
const Spark = require('node-sparky');
const express = require('express');
const bodyParser = require('body-parser');
const when = require('when');

const spark = new Spark({
  token: '<my token>',
  webhookSecret: 'somesecr3t',
});

const port = parseInt(process.env.PORT || '3000', 10);

// add events
spark.on('messages-created', msg => console.log(`${msg.personEmail} said: ${msg.text}`));

const app = express();
app.use(bodyParser.json());

// add route for path that is listening for web hooks
app.post('/webhook', spark.webhookListen());

// start express server
app.listen(port, function() {
  // get exisiting webhooks
  spark.webhooksGet()
    // remove all existing webhooks
    .then(webhooks => when.map(webhooks, webhook => spark.webhookRemove(webhook.id)))
    // create spark webhook directed back to the externally accessible
    // express route defined above.
    .then(() => spark.webhookAdd({
      name: 'my webhook',
      targetUrl: 'https://example.com/webhook',
      resource: 'all',
      event: 'all',
    });
  console.log(`Listening on port ${port}`);
});
```

## Using node-sparky in the Browser

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

## Contributing

#### Build

The `README.md` and `browser/node-sparky.*` files are auto-generated from the
files in /lib and /docs. To regenerate these run:

```bash
npm run build
```

#### Test

Tests require a user token and will not fully run using a bot token. It is
assumed that the user token has Org Admin permissions. If not, certain tests
WILL fail. The tests can be run via:

```bash
git clone https://github.com/flint-bot/sparky
cd sparky
npm install
SPARKY_API_TOKEN=someUserTokenHere npm test
```

# Support this Project

Find this project useful? Help suppport the continued development by submitting issues, feature requests, or code. Alternatively, you can...

<a href="https://ko-fi.com/S6S46XSW"><img src="https://az743702.vo.msecnd.net/cdn/kofi1.png?v=0" alt="Buy me a Coffee!" height="36"></a>

# Reference
