'use strict';

const assert = require('assert');
const when = require('when');
const Spark = require('../index');
const validator = require('../validator');

let spark;

describe('Test environment', function() {
  it('has variable TOKEN defined', function() {
    return when(assert.strictEqual(typeof process.env.TOKEN, 'string', 'environment variable TOKEN is not defined'));
  });
});

describe('Test token', function() {
  it('can authenticate to Spark API', function() {
    return validator.isToken(process.env.TOKEN)
      .then(function(token) {
        return when(assert((typeof token === 'string' && token.length > 0), 'token invalid'));
      });
  });
});

describe('#Spark() constructor', function() {
  it('returns a Spark instance', function() {
    spark = new Spark({token: process.env.TOKEN});
    return when(assert(spark instanceof Spark, 'constructor error'));
  });
});
