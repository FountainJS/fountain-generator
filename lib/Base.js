const _ = require('lodash');
const generators = require('yeoman-generator');

const fileUtils = require('./file-utils');

module.exports = generators.Base.extend({
  constructor() {
    generators.Base.apply(this, arguments);

    this.option('framework', { type: String, required: false });
    this.option('modules', { type: String, required: false });
    this.option('css', { type: String, required: false });
    this.option('js', { type: String, required: false });
    this.option('html', { type: String, required: false });
  },

  fountainPrompting() {
    const done = this.async();

    const prompts = [{
      when: !this.options.framework,
      type: 'list',
      name: 'framework',
      message: 'Which JavaScript framework do you want?',
      choices: [
        { name: 'React', value: 'react' },
        { name: 'Angular 1', value: 'angular1' },
        { name: 'Angular 2', value: 'angular2' }
      ]
    }, {
      when: !this.options.modules,
      type: 'list',
      name: 'modules',
      message: 'Which module management do you want?',
      choices(responses) {
        const choices = [
          { name: 'Webpack with NPM', value: 'webpack' },
          { name: 'SystemJS with JSPM', value: 'systemjs' }
        ];
        if (responses.framework !== 'angular2') {
          choices.push(
            { name: 'None with Bower and script injection', value: 'inject' }
          );
        }
        return choices;
      }
    }, {
      when: !this.options.css,
      type: 'list',
      name: 'css',
      message: 'Which CSS preprocessor do you want?',
      choices: [
        { name: 'SASS', value: 'scss' },
        { name: 'CSS', value: 'css' }
      ]
    }, {
      when: !this.options.js,
      type: 'list',
      name: 'js',
      message: 'Which JS preprocessor do you want?',
      choices: [
        { name: 'JS', value: 'js' }
      ]
    }, {
      when: !this.options.html,
      type: 'list',
      name: 'html',
      message: 'Which HTML template engine would you want?',
      choices: [
        { name: 'HTML', value: 'html' }
      ]
    }];

    this.prompt(prompts, props => {
      if (!_.isObject(this.props)) {
        this.props = {};
      }
      Object.assign(this.props, this.options, props);
      done();
    });
  },

  mergeJson: fileUtils.mergeJson,
  updateJson: fileUtils.updateJson,
  replaceInFile: fileUtils.replaceInFile

});
