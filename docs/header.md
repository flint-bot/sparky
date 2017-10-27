# node-sparky

[![NPM](https://nodei.co/npm/node-sparky.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/node-sparky/)

#### Cisco Spark API for Node JS (Version 4)

```js
var Spark = require('node-sparky');

var spark = new Spark({token: '<token>'});

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

The `README.md` and `browser/node-sparky.js` files are auto-generated from the
files in /lib and /docs. To regenerate these run:

```bash
npm run build
```

# Reference
