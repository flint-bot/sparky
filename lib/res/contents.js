const when = require('when');
const mime = require('mime-types');
const fs = require('fs');
const fsp = require('when/node').liftAll(fs);
const path = require('path');
const validator = require('../validator');

/**
 * @description File Object
 *
 * @namespace File
 * @property {String} name - File name
 * @property {String} ext - File extension
 * @property {String} type - Header [content-type] for file
 * @property {Buffer} binary - File contents as binary
 * @property {String} base64 - File contents as base64 encoded string
 */

const Contents = (Spark) => {
  const contents = {
    /**
     * @description Returns a File Object specified by Content ID or Content URL.
     *
     * @memberof Spark
     * @function
     * @param {String} contentId Spark Content ID or URL
     * @returns {Promise.<File>} File object
     *
     * @example
     * spark.contentGet('Tm90aGluZyB0byBzZWUgaGVy')
     *   .then(file => console.log('File name: %s', file.name))
     *   .catch(err => console.error(err));
     */
    contentGet: (contentId) => {
      let id = contentId;

      // normalize URL to contentId
      if (validator.isUrl(contentId)) {
        id = contentId.match(/contents\/(.*)/)[1];
      }

      return Spark.request('get', 'contents', id)
        .then((res) => {
          if (res && res.headers && res.headers['content-disposition']) {
            const file = {};
            file.name = res.headers['content-disposition'].match(/"(.*)"/)[1];
            file.ext = file.name.split('.').pop();
            file.type = res.headers['content-type'];
            file.binary = new Buffer(res.body, 'binary');
            file.base64 = new Buffer(res.body, 'binary').toString('base64');
            return when(file);
          }
          return when.reject(new Error('could not retrieve file headers'));
        });
    },

    /**
     * @description Create File Object from local file path.
     *
     * @memberof Spark
     * @function
     * @param {String} filePath Path to file
     * @param {Integer} [timeout=15000] Timeout in ms to read file (optional)
     * @returns {Promise.<File>} File
     *
     * @example
     * spark.contentCreate('/some/local/file.png')
     *   .then(file => console.log(file.name))
     *   .catch(err => console.error(err));
     */
    contentCreate: (filePath, timeout) => {
      const t = (timeout && typeof _timeout === 'number') ? timeout : 15000;

      if (validator.isFilePath(filePath)) {
        return fsp.readFile(filePath).timeout(t)
          .then((bin) => {
            const file = {};
            file.name = path.basename(filePath);
            file.ext = file.name.split('.').pop();
            file.type = mime.lookup(file.ext);
            file.binary = bin;
            file.base64 = bin.toString('base64');
            return when(file);
          });
      }
      return when.reject(new Error(`invalid or missing file at "${filePath}"`));
    },

  };

  return contents;
};

module.exports = Contents;
