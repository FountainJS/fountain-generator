'use strict';

const exec = require('mz/child_process').exec;
const co = require('co');
const locate = require('./locate');

const command = 'git status';

co(function *() {
  try {
    const folders = yield locate.folders();
    const commandPromises = folders.map(folder => {
      return exec(command, { cwd: folder });
    });
    const commandResults = yield Promise.all(commandPromises);
    commandResults
      .forEach((commandResult, index) => {
        if (commandResult[0].indexOf('nothing to commit, working directory clean') === -1) {
          console.log(folders[index]);
          console.log(commandResult[0]);
        }
      });
  } catch (error) {
    console.error('Something went wrong', error);
  }
});
