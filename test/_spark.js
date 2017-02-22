'use strict';

const assert = require('assert');
const when = require('when');
const Spark = require('../');
const validator = require('../validator');

let spark;

describe('Test environment', function() {
  it('has variable TOKEN defined', function() {
    return when(assert.strictEqual(typeof process.env.TOKEN, 'string', 'environment variable TOKEN is not defined'));
  });
});

describe('#Spark() constructor', function() {
  it('returns a Spark instance', function() {
    return when(assert(spark = new Spark({token: process.env.TOKEN}), 'constructor error'));
  });
});
