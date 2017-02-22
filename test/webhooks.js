'use strict';

const assert = require('assert');
const when = require('when');
const Spark = require('../');
const validator = require('../validator');

let spark;

if(typeof process.env.TOKEN === 'string') {
  spark = new Spark({token: process.env.TOKEN});

  describe('#Spark.webhooksGet()', function() {
    it('returns an array of spark webhook objects', function() {
      return spark.webhooksGet()
        .then(function(webhooks) {
          return when(assert(validator.isWebhooks(webhooks), 'invalid response'));
        });
    });
  });
}
