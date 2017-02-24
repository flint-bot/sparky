'use strict';

const when = require('when');
const mime = require('mime-types');

const fs = require('fs');
const readFile = require('when/node').lift(fs.readFile);

const validator = require('../validator');

/**
 * File Object
 *
 * @namespace File
 * @property {String} name - File name
 * @property {String} ext - File extension
 * @property {String} type - Header [content-type] for file
 * @property {Buffer} binary - File contents as binary
 * @property {String} base64 - File contents as base64 encoded string
 */

module.exports = function(Spark) {

  /**
   * Returns a File Object specified by Content ID or Content URL.
   *
   * @function
   * @param {String} contentId - Spark Content ID or URL
   * @returns {Promise.<File>} File
   *
   * @example
   * spark.contentGet('Tm90aGluZyB0byBzZWUgaGVyZS4uLiBNb3ZlIGFsb25nLi4u')
   *   .then(function(file) {
   *     console.log('File name: %s', file.name);
   *   })
   *   .catch(function(err){
   *     console.log(err);
   *   });
   */
  Spark.contentGet = function(contentId) {
    // normalize URL to contentId
    if(validator.isUrl(contentId)) contentId = contentId.match(/contents\/(.*)/)[1];

    return Spark.request('get', 'contents', contentId)
      .then(res => {
        if(res && res.headers && res.headers['content-disposition']) {
          let file = {};
          file.name = res.headers['content-disposition'].match(/"(.*)"/)[1];
          file.ext = file.name.split('.').pop();
          file.type = res.headers['content-type'];
          file.binary = new Buffer(res.body, 'binary');
          file.base64 = new Buffer(res.body, 'binary').toString('base64');
          return when(file);
        } else {
          return when.reject(new Error('could not retrieve file headers'));
        }
      });
  };

  /**
   * Create File Object from local file path.
   *
   * @function
   * @param {String} filePath - Path to file
   * @param {Integer} [timeout=15000] - Timeout in ms to read file (optional)
   * @returns {Promise.<File>} File
   *
   * @example
   * spark.contentCreate('/some/local/file.png')
   *   .then(function(file) {
   *     console.log(file.name);
   *   })
   *   .catch(function(err) {
   *     console.log(err);
   *   });
   */
  Spark.contentCreate = function(filePath, timeout) {
    timeout = (timeout && typeof timeout === 'number') ? timeout : 15000;
    if(validator.isFilePath(filePath)) {
      return validator.isFile(filePath)
        .then(() => readFile(filePath).timeout(timeout))
        .then(bin => {
          let file = {};
          file.name = filePath.replace(/^.*[\\\/]/, '');
          file.ext = file.name.split('.').pop();
          file.type = mime.lookup(file.ext);
          file.binary = bin;
          file.base64 = bin.toString('base64');
          return when(file);
        });
    } else {
      return when.reject(new Error('invalid or missing file at "' + filePath + '"'));
    }
  };

  // return the Spark Object
  return Spark;
};
