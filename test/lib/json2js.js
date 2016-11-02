const test = require('ava');

test('Format template literals', t => {
  const lit = require('../../lib/json2js').lit;
  const files = `conf.path.src('app/**/*.js')`;
  const result = lit`glob.sync(${files})`;
  t.is(result, `lit>>glob.sync(conf.path.src('app/**/*.js'))<<lit`);
});

test(`Return json object when js object contains no 'lit'`, t => {
  const json = require('../../lib/json2js').json;
  const obj = {
    server: {
      baseDir: []
    },
    open: false
  };
  const result = json(obj);
  const expected =
`{
  server: {
    baseDir: []
  },
  open: false
}`;
  t.is(result, expected);
});

test(`Return json object when js object contains template literal`, t => {
  const json = require('../../lib/json2js').json;
  const obj = {
    server: {
      name: `lit>>glob.sync(conf.path.src('app/**/*.js'))<<lit`
    },
    open: false
  };
  const result = json(obj);
  const expected =
`{
  server: {
    name: glob.sync(conf.path.src('app/**/*.js'))
  },
  open: false
}`;
  t.is(result, expected);
});

test(`Return json object indented with 2 spaces`, t => {
  const json = require('../../lib/json2js').json;
  const obj = {
    server: {
      baseDir: []
    },
    open: false
  };
  const result = json(obj, 2);
  const expected =
`{
    server: {
      baseDir: []
    },
    open: false
  }`;
  t.is(result, expected);
});

test(`Return json object when js object contains template literal as key`, t => {
  const json = require('../../lib/json2js').json;
  const obj = {
    'lit>>toto<<lit': {
      baseDir: []
    },
    open: false
  };
  const result = json(obj);
  const expected =
`{
  [toto]: {
    baseDir: []
  },
  open: false
}`;
  t.is(result, expected);
});
