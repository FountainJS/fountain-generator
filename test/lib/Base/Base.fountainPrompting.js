const test = require('ava');
const chai = require('chai');
const spies = require('chai-spies');
chai.use(spies);
const generators = require('yeoman-generator');

let context;

test.before(() => {
  context = {
    props: {}
  };
  generators.extend = description => Object.assign(context, description, generators);
  generators.apply = () => {};
  require('../../../lib/Base');
});

function setup(framework, fixture, context) {
  context.options = {framework};
  context.prompt = questions => {
    questions.forEach(question => {
      if (typeof question.choices === 'function') {
        question.choices(fixture);
      }
    });
    return {
      then: cb => cb(fixture)
    };
  };
  return context;
}

test('Set the props to the prompts value', t => {
  const fixture = {framework: 'angular1', js: 'js', modules: 'webpack'};
  context = setup('angular1', fixture, context);
  context.fountainPrompting();
  t.deepEqual(context.props, fixture);
});

test(`Set the props to the prompts value when framework is 'angular2'`, t => {
  const fixture = {js: 'js', modules: 'webpack'};
  setup('angular2', fixture, context);
  context.fountainPrompting();
  t.deepEqual(context.props, Object.assign(fixture, {framework: 'angular2'}));
});

test('Clear the props if props is not an object', t => {
  context.props = null;
  context.prompt = () => {
    return {
      then: cb => cb()
    };
  };
  context.fountainPrompting();
  t.deepEqual(context.props, context.options);
});
