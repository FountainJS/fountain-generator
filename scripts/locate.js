'use strict';

const fs = require('mz/fs');
const path = require('path');

const fountainFolder = 'FountainJS';
const excludes = ['.DS_Store', 'Sandbox', 'generator-fountain-angularjs-gulpfile'];

const currentPath = process.cwd();
const fountainRoot = currentPath.substring(0, currentPath.indexOf(fountainFolder) + fountainFolder.length);

exports.folders = function *() {
  const foldersUnfiltered = yield fs.readdir(fountainRoot);
  return foldersUnfiltered
    .filter(folder => excludes.indexOf(folder) === -1)
    .map(folder => path.join(fountainRoot, folder));
};
