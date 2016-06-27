const test = require('ava');
const Utils = require('../../utils');

let context;

test.beforeEach(() => {
  context = Utils.mock();
  context.writeJSON = {};
  context.write = {};
});

test(`Replace 'var' by 'const' in 'file.js'`, t => {
  const replaceInFiles = require('../../../lib/file-utils').replaceInFiles;
  replaceInFiles.call(context, '../test/assets/*.js', content => content.replace(/var/g, 'const'));
  t.is(context.write[context.templatePath('../test/assets/file.js')], 'const x = 42;\n');
});
