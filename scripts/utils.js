'use strict';

const _ = require('lodash');
const exec = require('mz/child_process').exec;
const fs = require('mz/fs');
const path = require('path');

const fountainFolder = 'FountainJS';
const excludes = ['.DS_Store', 'Sandbox', 'generator-fountain-angularjs-gulpfile'];
const versionRegex = /("version" *: *")(\d+\.\d+\.\d+)(")/;

const currentPath = process.cwd();
const fountainRoot = currentPath.substring(0, currentPath.indexOf(fountainFolder) + fountainFolder.length);

let folderCache = null;
exports.folders = function *() {
  if (folderCache === null) {
    const foldersUnfiltered = yield fs.readdir(fountainRoot);
    folderCache = foldersUnfiltered
      .filter(folder => excludes.indexOf(folder) === -1)
      .map(folder => path.join(fountainRoot, folder));
  }
  return folderCache;
};

exports.each = function *(callback) {
  const folders = yield exports.folders();
  let results = folders.map(folder => ({
    folder,
    result: callback(folder)
  }));
  if (results.length > 0 &&
      _.isObject(results[0].result) &&
      _.isFunction(results[0].result.then)) {
    results = results.map(result => {
      return {
        folder: result.folder,
        promise: result.result
      };
    });
    const promises = results.map(result => result.promise);
    const promiseResults = yield Promise.all(promises);
    promiseResults.forEach((result, i) => {
      results[i].result = result;
    });
  }
  return results;
};

exports.execOnEach = function *(command) {
  const results = yield exports.each(folder => {
    return exec(command, { cwd: folder });
  });
  return results;
};

exports.readVersion = function *(folder) {
  const file = yield fs.readFile(path.join(folder, 'package.json'));
  const version = versionRegex.exec(file)[2];
  return version;
};

exports.updateVersion = function *(folder, version) {
  const filePath = path.join(folder, 'package.json');
  const file = yield fs.readFile(filePath);
  const newFile = file.toString().replace(versionRegex, `$1${version}$3`);
  yield fs.writeFile(filePath, newFile);
};
