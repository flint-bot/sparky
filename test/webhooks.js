const assert = require('assert');
const when = require('when');
const Spark = require('../');
const validator = require('../validator');

let spark;

if (typeof process.env.TOKEN === 'string') {
  spark = new Spark({ token: process.env.TOKEN });

  describe('#Spark.webhooksGet()', () => {
    it('returns an array of spark webhook objects', () => spark.webhooksGet()
      .then(webhooks => when(assert(validator.isWebhooks(webhooks), 'invalid response'))));
  });

  describe('#Spark.webhooksGet({resource: \'messages\'})', () => {
    it('returns an array of spark webhook objects', () => spark.webhooksGet({ resource: 'messages' })
      .then(webhooks => when(assert(validator.isWebhooks(webhooks), 'invalid response or no webhooks match search criteria'))));
  });

  describe('#Spark.webhookAuth()', () => {
    it('calculates hmac-sha1 and verifies on test data.', () => {
      const secret = 'testSecret1234';
      const sig = 'e514a9a0d82760314204c2b9d9eff2fef2b51511';
      const payload = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean vitae sodales elit. Mauris eleifend odio lacus. Integer eu volutpat neque, id varius magna. Nullam ac ex blandit orci blandit varius. Maecenas sollicitudin, lacus ut pharetra cursus, lorem dui egestas massa, a pharetra massa velit sed enim. Sed maximus enim elit, eget tincidunt ante semper eget. Donec vitae tincidunt est. Ut tincidunt erat a tellus dignissim, sit amet egestas diam aliquet. Proin ante massa, vulputate id facilisis vel, faucibus ut diam. Integer nec enim laoreet, ultrices sapien vitae, suscipit urna. Suspendisse bibendum elit eros, et pellentesque nisl tincidunt sed. Proin at auctor magna. Vestibulum blandit, arcu in consectetur varius, neque neque suscipit velit, quis venenatis ipsum dolor non odio. Suspendisse potenti. Mauris volutpat lorem id lacus convallis scelerisque. Pellentesque efficitur ullamcorper metus, sed aliquam ex volutpat in.';

      return spark.webhookAuth(secret, sig, payload)
        .then(ok => when(assert(ok, 'invalid response')));
    });
  });
}
