const test = require('ava');
const Utils = require('../../utils');

let context;

test.beforeEach(() => {
  context = Utils.mock();
  context.writeJSON = {};
  context.write = {};
});

test('Write fixture object in package.json', t => {
  const mergeJson = require('../../../lib/file-utils').mergeJson;
  const fixture = {
    dependencies: {angular: '^1.5.0'}
  };
  mergeJson.call(context, '../test/assets/package.json', fixture);
  t.deepEqual(context.writeJSON[context.templatePath('../test/assets/package.json')], fixture);
});

test('Write fixture object in .babelrc which already contains Array', t => {
  const mergeJson = require('../../../lib/file-utils').mergeJson;
  const fixture = {
    presets: ['es2015', 'react']
  };
  mergeJson.call(context, '../test/assets/.babelrc', fixture);
  t.deepEqual(context.writeJSON[context.templatePath('../test/assets/.babelrc')], fixture);
});
