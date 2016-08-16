const test = require('ava');
const chai = require('chai');
const expect = chai.expect;
const spies = require('chai-spies');
chai.use(spies);
const generators = require('yeoman-generator');

let context;

test.before(() => {
  context = {
    props: {}
  };
  generators.Base.extend = description => Object.assign(context, description, generators.Base);
  generators.Base.apply = () => {};
  require('../../../lib/Base');
});

test(`Call 'this.option' 5 times with correct parameters`, () => {
  context.option = () => {};
  const spy = chai.spy.on(context, 'option');
  context.constructor();
  expect(spy).to.have.been.called.exactly(5);
  expect(spy).to.have.been.called.with('framework');
  expect(spy).to.have.been.called.with('modules');
  expect(spy).to.have.been.called.with('css');
  expect(spy).to.have.been.called.with('js');
  expect(spy).to.have.been.called.with('ci');
});
