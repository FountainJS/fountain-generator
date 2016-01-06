'use strict';

const co = require('co');
const utils = require('./utils');

const command = process.argv.slice(2).join(' ');

co(function *() {
  try {
    const results = yield utils.execOnEach(command);
    results.forEach(result => {
      console.log(result.folder);
      console.log(result.result[0]);
    });
  } catch (error) {
    console.error('Something went wrong', error);
  }
});
