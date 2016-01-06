'use strict';

const co = require('co');
const utils = require('./utils');

co(function *() {
  try {
    const results = yield utils.execOnEach('git status');
    results
      .filter(result => {
        return result.result[0].indexOf('nothing to commit') === -1;
      })
      .forEach(result => {
        console.log(result.folder);
        console.log(result.result[0]);
      });
  } catch (error) {
    console.error('Something went wrong', error);
  }
});
