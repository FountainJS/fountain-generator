const _ = require('lodash');
const memFs = require('mem-fs');
const editor = require('mem-fs-editor');
const ejs = require('ejs');
const path = require('path');
const json = require('./json2js').json;
const fileUtils = require('./file-utils');

module.exports = {
  defaults() {
    const opts = {
      framework: 'react',
      modules: 'webpack',
      js: 'js',
      css: 'css',
      sample: 'techs',
      router: 'router'
    };
    return {
      options: opts,
      props: opts
    };
  },
  mock(generator) {
    generator = generator ? generator : 'app';
    const Base = require('./Base');
    const context = Object.assign({}, this.defaults());
    const store = memFs.create();
    const fs = editor.create(store);
    Base.extend = description => {
      Object.assign(context, description);
    };
    context.mergeJson = (file, content) => {
      context.mergeJson[file] = _.mergeWith(context.mergeJson[file], content, (a, b) => {
        if (_.isArray(a)) {
          return _.uniq(a.concat(b));
        }
      });
    };
    context.updateJson = (file, update) => {
      context.updateJson[file] = update({});
    };
    context.copyTemplate = (file, dest, templateScope) => {
      const scope = Object.assign({}, {json}, context.options, templateScope);
      const files = {template: file, destination: ''};
      fileUtils.renameFiles(files, context.options);
      const filePath = path.join(`generators/${generator}/templates`, files.template);
      const content = fs.read(filePath);
      const rendered = ejs.render(content, scope);
      context.copyTemplate[file] = rendered;
    };
    return context;
  },
  call(context, method, options) {
    Object.assign(context.options, options);
    _.get(context, method).call(context);
  }
};
