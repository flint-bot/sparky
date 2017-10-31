const Spark = require('../index');
const express = require('express');
const bodyParser = require('body-parser');
const when = require('when');

const spark = new Spark({
  token: process.env.TOKEN,
  webhookSecret: 'somesecr3t',
});

// add events
spark.on('messages-created', msg => console.log(`${msg.personEmail} said: ${msg.text}`));

const app = express();
app.use(bodyParser.json());

// add route for path that is listening for web hooks
app.post('/webhook', spark.webhookListen());

// start express server
app.listen(process.env.PORT, () => {
  // create spark webhook directed back to express route defined above
  spark.webhooksGet()
    .then(webhooks => when.map(webhooks, webhook => spark.webhookRemove(webhook.id)))
    .then(() => spark.webhookAdd({
      name: 'my webhook',
      targetUrl: 'http://mywebhost.com/webhook',
      resource: 'all',
      event: 'all',
    }));
  console.log(`Listening on port ${process.env.PORT}`);
});
