const _ = require('lodash');
const generators = require('yeoman-generator');

const fileUtils = require('./file-utils');
const techs = require('./techs');

module.exports = generators.Base.extend({
  constructor() {
    generators.Base.apply(this, arguments);

    this.option('framework', {type: String, required: false});
    this.option('modules', {type: String, required: false});
    this.option('css', {type: String, required: false});
    this.option('js', {type: String, required: false});
    // this.option('html', {type: String, required: false });
  },

  fountainPrompting() {
    const fmk = this.options.framework;
    const prompts = [{
      when: !this.options.framework,
      type: 'list',
      name: 'framework',
      message: 'Which JavaScript framework do you want?',
      choices: [
        {name: 'React', value: 'react'},
        {name: 'Angular 2', value: 'angular2'},
        {name: 'Angular 1', value: 'angular1'}
      ]
    }, {
      when: !this.options.modules,
      type: 'list',
      name: 'modules',
      message: 'Which module management do you want?',
      choices(responses) {
        const choices = [
          {name: 'Webpack with NPM', value: 'webpack'},
          {name: 'SystemJS with JSPM', value: 'systemjs'}
        ];
        if (responses.framework !== 'angular2' && fmk !== 'angular2') {
          choices.push(
            {name: 'None with Bower and script injection', value: 'inject'}
          );
        }
        return choices;
      }
    }, {
      when: !this.options.js,
      type: 'list',
      name: 'js',
      message: 'Which JS preprocessor do you want?',
      choices: [
        {name: 'ES2015 today with Babel', value: 'babel'},
        {name: 'Pure old JavaScript', value: 'js'},
        {name: 'TypeScript', value: 'typescript'}
      ]
    }, {
      when: !this.options.css,
      type: 'list',
      name: 'css',
      message: 'Which CSS preprocessor do you want?',
      choices: [
        {name: 'SASS', value: 'scss'},
        {name: 'Less', value: 'less'},
        {name: 'CSS', value: 'css'}
      ]
    // }, {
    //   when: !this.options.html,
    //   type: 'list',
    //   name: 'html',
    //   message: 'Which HTML template engine would you want?',
    //   choices: [
    //     {name: 'HTML', value: 'html' }
    //   ]
    }];

    return this.prompt(prompts).then(props => {
      if (!_.isObject(this.props)) {
        this.props = {};
      }
      Object.assign(this.props, _.omit(this.options, ['env']), props);
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
