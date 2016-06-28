const test = require('ava');
const Utils = require('../../utils');

let context;

test.beforeEach(() => {
  context = Utils.mock();
  context.writeJSON = {};
  context.write = {};
});

let FileUtils;
let renameFiles;

test.before(() => {
  FileUtils = require('../../../lib/file-utils');
  FileUtils.getExtensions = () => {
    return {js: 'babel', modules: 'webpack', framework: 'react', css: 'css'};
  };
  renameFiles = FileUtils.renameFiles;
  FileUtils.renameFiles = () => {};
});

test('Copy file.js', t => {
  FileUtils.copyTemplate.call(context, '../test/assets/file.js', '../test/assets/templates/file.js');
  t.true(context.copyTpl[context.templatePath('../test/assets/templates/file.js')].length > 0);
});

test.after(() => {
  FileUtils.renameFiles = renameFiles;
});
