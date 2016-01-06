'use strict';

const exec = require('mz/child_process').exec;
const co = require('co');
const locate = require('./locate');

const command = process.argv.slice(2).join(' ');

co(function *() {
  try {
    const folders = yield locate.folders();
    const commandPromises = folders.map(folder => {
      return exec(command, { cwd: folder });
    });
    const commandResults = yield Promise.all(commandPromises);
    commandResults.forEach((commandResult, index) => {
      console.log(folders[index]);
      console.log(commandResult[0]);
    });
  } catch (error) {
    console.error('Something went wrong', error);
  }
});
