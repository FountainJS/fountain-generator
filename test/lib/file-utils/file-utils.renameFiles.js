const test = require('ava');
const Utils = require('../../utils');

let context;

test.beforeEach(() => {
  context = Utils.mock();
  context.writeJSON = {};
  context.write = {};
});

test('Check .babelrc is not renamed', t => {
  const files = {
    template: '../../test/assets/.babelrc',
    destination: '../../test/assets/.babelrc'
  };
  require('../../../lib/file-utils').renameFiles.call(context, files, {});
  t.is(files.template, '../../test/assets/.babelrc');
  t.is(files.destination, '../../test/assets/.babelrc');
});

let jsFiles;

test.beforeEach(() => {
  jsFiles = {
    template: 'src/file.js',
    destination: 'src/file.js'
  };
});

test(`should rename files with js of 'babel'`, t => {
  require('../../../lib/file-utils').renameFiles.call(context, jsFiles, {js: 'babel'});
  t.is(jsFiles.template, 'src/file.babel');
  t.is(jsFiles.destination, 'src/file.js');
});

test(`should rename files with js of 'typescript' and framework different of 'react'`, t => {
  require('../../../lib/file-utils').renameFiles.call(context, jsFiles, {js: 'typescript', framework: 'angular1'});
  t.is(jsFiles.template, 'src/file.ts');
  t.is(jsFiles.destination, 'src/file.ts');
});

test(`should rename files with js of 'typescript' and framework of 'react'`, t => {
  require('../../../lib/file-utils').renameFiles.call(context, jsFiles, {js: 'typescript', framework: 'react'});
  t.is(jsFiles.template, 'src/file.tsx');
  t.is(jsFiles.destination, 'src/file.tsx');
});

let cssFiles;

test.beforeEach(() => {
  cssFiles = {
    template: 'src/file.css',
    destination: 'src/file.css'
  };
});

test('should rename .scss files', t => {
  require('../../../lib/file-utils').renameFiles.call(context, cssFiles, {css: 'scss'});
  t.is(cssFiles.template, 'src/file.scss');
  t.is(cssFiles.destination, 'src/file.scss');
});

test('should rename .less files', t => {
  require('../../../lib/file-utils').renameFiles.call(context, cssFiles, {css: 'less'});
  t.is(cssFiles.template, 'src/file.less');
  t.is(cssFiles.destination, 'src/file.less');
});

test('should rename .styl files', t => {
  require('../../../lib/file-utils').renameFiles.call(context, cssFiles, {css: 'styl'});
  t.is(cssFiles.template, 'src/file.styl');
  t.is(cssFiles.destination, 'src/file.styl');
});
