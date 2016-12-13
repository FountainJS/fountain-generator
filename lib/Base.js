const _ = require('lodash');
const generators = require('yeoman-generator');
const chalk = require('chalk');

const fileUtils = require('./file-utils');
const techs = require('./techs');

module.exports = generators.Base.extend({
  constructor() {
    generators.Base.apply(this, arguments);

    this.option('framework', {type: String, required: false});
    this.option('modules', {type: String, required: false});
    this.option('css', {type: String, required: false});
    this.option('js', {type: String, required: false});
    this.option('ci', {type: String, required: false});
    // this.option('html', {type: String, required: false });
  },

  fountainPrompting() {
    const {framework, modules, js} = this.options;
    const prompts = [{
      when: !this.options.framework,
      type: 'list',
      name: 'framework',
      message: 'Which JavaScript framework do you want?',
      choices: [
        {name: 'React', value: 'react'},
        {name: 'Angular 2', value: 'angular2'},
        {name: 'Angular 1', value: 'angular1'},
        {name: 'Vue.js 2 with Webpack and ES2015', value: 'vue'},
        {name: chalk.gray('Ember 2'), value: 'ember', disabled: chalk.gray('Wished. Contributors welcome.')},
        {name: chalk.gray('Backbone'), value: 'backbone', disabled: chalk.gray('Wished. Contributors welcome.')}
      ]
    }, {
      when(responses) {
        if (responses.framework === 'vue') {
          responses.modules = 'webpack';
          return false;
        }
        return !responses.modules && !modules;
      },
      type: 'list',
      name: 'modules',
      message: 'Which module management do you want?',
      choices(responses) {
        const choices = [
          {name: 'Webpack with NPM', value: 'webpack'},
          {name: 'SystemJS with JSPM', value: 'systemjs'},
          {name: chalk.gray('Browserify'), value: 'browserify', disabled: chalk.gray('Wished. Contributors welcome.')}
        ];
        if (responses.framework !== 'angular2' && framework !== 'angular2') {
          choices.push({name: 'None with Bower and script injection', value: 'inject'});
        }
        return choices;
      }
    }, {
      when(responses) {
        if (responses.framework === 'vue') {
          responses.js = 'babel';
          return false;
        }
        return !responses.js && !js;
      },
      type: 'list',
      name: 'js',
      message: 'Which JS preprocessor do you want?',
      choices(responses) {
        const choices = [{name: 'ES2015 today with Babel', value: 'babel'}];
        if (responses.framework !== 'vue' && framework !== 'vue') {
          choices.push({name: 'Pure old JavaScript', value: 'js'});
          choices.push({name: 'TypeScript', value: 'typescript'});
        }
        return choices;
      }
    }, {
      when: !this.options.css,
      type: 'list',
      name: 'css',
      message: 'Which CSS preprocessor do you want?',
      choices: [
        {name: 'SASS', value: 'scss'},
        {name: 'Stylus', value: 'styl'},
        {name: 'Less', value: 'less'},
        {name: 'CSS', value: 'css'},
        {name: chalk.gray('CSSNext'), value: 'cssnext', disabled: chalk.gray('Wished. Contributors welcome.')}
      ]
    // }, {
    //   when: !this.options.html,
    //   type: 'list',
    //   name: 'html',
    //   message: 'Which HTML template engine would you want?',
    //   choices: [
    //     {name: 'HTML', value: 'html' }
    //   ]
    }, {
      when: !this.options.ci,
      type: 'checkbox',
      name: 'ci',
      message: 'Which Continuous Integration platform do you want?',
      choices: [
        {name: 'Travis', value: 'travis'},
        {name: 'CircleCi', value: 'circleci'},
        {name: 'Jenkins (with Dockerfile)', value: 'jenkins'},
        {name: 'Wercker', value: 'wercker'}
      ]
    }];

    return this.prompt(prompts).then(props => {
      if (!_.isObject(this.props)) {
        this.props = {};
      }
      Object.assign(this.props, _.omit(this.options, ['env', 'skip-install', 'skip-cache']), props);
    });
  },

  mergeJson: fileUtils.mergeJson,
  updateJson: fileUtils.updateJson,
  replaceInFileWithTemplate: fileUtils.replaceInFileWithTemplate,
  replaceInFiles: fileUtils.replaceInFiles,
  addTransform: fileUtils.addTransform,
  copyTemplate: fileUtils.copyTemplate,
  prepareTechJson: techs.prepareTechJson,
  getExtensions: fileUtils.getExtensions

});
