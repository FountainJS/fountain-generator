const test = require('ava');
const Utils = require('../../utils');

let context;

test.beforeEach(() => {
  context = Utils.mock();
  context.writeJSON = {};
  context.write = {};
});

test('Remove presets key from .babelrc', t => {
  const updateJson = require('../../../lib/file-utils').updateJson;
  const update = babelrc => {
    delete babelrc.presets;
    return babelrc;
  };
  updateJson.call(context, '../test/assets/.babelrc', update);
  t.deepEqual(context.writeJSON[context.templatePath('../test/assets/.babelrc')], {});
});
