const _ = require('lodash');

const techs = require('./techs.json');

exports.prepareTechJson = function prepareTechJson() {
  const selection = [
    'gulp', 'browsersync', 'karma',
    this.props.framework,
    this.props.modules,
    this.props.js,
    this.props.css
  ];

  if (this.props.js === 'typescript') {
    selection.push('tslint');
  } else {
    selection.push('eslint');
  }

  const selected = _.filter(techs, tech => {
    return _.includes(selection, tech.key);
  });

  this.fs.writeJSON(this.destinationPath('src/app/techs/techs.json'), selected);
};
