const assert = require('assert');
const when = require('when');
const Spark = require('../index');
const validator = require('../validator');

describe('Test environment', () => {
  it('has variable TOKEN defined', () => when(assert.strictEqual(typeof process.env.TOKEN, 'string', 'environment variable TOKEN is not defined')));
});

describe('Test token', () => {
  it('can authenticate to Spark API', () => validator.isToken(process.env.TOKEN)
    .then(token => when(assert((typeof token === 'string' && token.length > 0), 'token invalid'))));
});

describe('#Spark() constructor', () => {
  it('returns a Spark instance', () => {
    const spark = new Spark({ token: process.env.TOKEN });
    return when(assert(spark instanceof Spark, 'constructor error'));
  });
});
