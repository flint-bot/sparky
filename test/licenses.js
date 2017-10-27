'use strict';

const assert = require('assert');
const when = require('when');
const Spark = require('../');
const validator = require('../validator');

let spark;
let orgLicenses;

if(typeof process.env.TOKEN === 'string') {
  spark = new Spark({token: process.env.TOKEN});

  describe('#Spark.licensesGet()', function() {
    it('returns an array of spark license objects', function() {
      return spark.licensesGet()
        .then(function(licenses) {
          return when(assert(validator.isLicenses(licenses), 'invalid response'));
        });
    });
  });

  describe('#Spark.licensesGet(orgId)', function() {
    it('returns an array of spark license objects', function() {
      return spark.personMe()
        .then(me => when(me.orgId))
        .then(orgId => spark.licensesGet(orgId))
        .then((licenses) => {
          orgLicenses = licenses;
          return when(assert(validator.isLicenses(licenses), 'invalid response'));
        });
    });
  });

  describe('#Spark.licenseGet(licenseId)', function() {
    it('returns an array of spark license objects', function() {
      // skip licensesGet if orgLicenses is not defined
      if(!(orgLicenses instanceof Array && orgLicenses.length > 0)) {
        this.skip();
      } else {
        return spark.licenseGet(orgLicenses[0].id)
          .then(function(license) {
            return when(assert(validator.isLicense(license), 'invalid response'));
          });
      }
    });
  });
}
