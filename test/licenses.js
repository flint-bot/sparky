const assert = require('assert');
const when = require('when');
const Spark = require('../');
const validator = require('../validator');

let orgLicenses;

if (typeof process.env.TOKEN === 'string') {
  const spark = new Spark({ token: process.env.TOKEN });

  describe('#Spark.licensesGet()', () => {
    it('returns an array of spark license objects', () => spark.licensesGet()
      .then(licenses => when(assert(validator.isLicenses(licenses), 'invalid response'))));
  });

  describe('#Spark.licensesGet(orgId)', () => {
    it('returns an array of spark license objects', () => spark.personMe()
      .then(me => when(me.orgId))
      .then(orgId => spark.licensesGet(orgId))
      .then((licenses) => {
        orgLicenses = licenses;
        return when(assert(validator.isLicenses(licenses), 'invalid response'));
      }));
  });

  describe('#Spark.licenseGet(licenseId)', () => {
    it('returns spark license object', () => {
      // skip licensesGet if orgLicenses is not defined
      if (!(orgLicenses instanceof Array && orgLicenses.length > 0)) {
        this.skip();
        return when.reject(new Error('org licenses not found'));
      }
      return spark.licenseGet(orgLicenses[0].id)
        .then(license => when(assert(validator.isLicense(license), 'invalid response')));
    });
  });
}
