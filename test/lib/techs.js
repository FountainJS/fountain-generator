const test = require('ava');
const chai = require('chai');
chai.should();
chai.use(require('chai-things'));
const Utils = require('../utils');

function setup(js) {
  const prepareTechJson = require('../../lib/techs').prepareTechJson;
  const context = Utils.mock({
    options: {
      framework: 'angular2',
      modules: 'sytemjs',
      js,
      css: 'styl'
    },
    writeJSON: {}
  });
  prepareTechJson.call(context);
  return context.writeJSON[context.destinationPath('src/app/techs/techs.json')];
}

test('Return techs.json with typescript', () => {
  const techsJson = setup('typescript');
  techsJson.should.contain.a.thing.with.property('key', 'tslint');
});

test('Return techs.json with babel', () => {
  const techsJson = setup('babel');
  techsJson.should.contain.a.thing.with.property('key', 'eslint');
});
