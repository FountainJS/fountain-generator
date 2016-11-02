const _ = require('lodash');

const techs = require('./techs.json');

exports.prepareTechJson = function () {
  const selection = [
    'gulp', 'browsersync', 'karma',
    this.options.framework,
    this.options.modules,
    this.options.js,
    this.options.css
  ];

  if (this.options.js === 'typescript') {
    selection.push('tslint');
  } else {
    selection.push('eslint');
  }

  const selected = _.filter(techs, tech => {
    return _.includes(selection, tech.key);
  });

  this.fs.writeJSON(this.destinationPath('src/app/techs/techs.json'), selected);
};
