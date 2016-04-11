const _ = require('lodash');
const memFs = require('mem-fs');
const editor = require('mem-fs-editor');
const ejs = require('ejs');
const path = require('path');
const json = require('./json2js').json;
const fileUtils = require('./file-utils');

module.exports = {
  defaults() {
    return {
      props: {
        framework: 'react',
        modules: 'webpack',
        js: 'js',
        css: 'css'
      }
    };
  },
  mock() {
    const Base = require('./Base');
    const context = Object.assign({}, this.defaults());
    const store = memFs.create();
    const fs = editor.create(store);
    Base.extend = description => {
      Object.assign(context, description);
    };
    context.mergeJson = (file, content) => {
      context.mergeJson[file] = content;
    };
    context.updateJson = (file, update) => {
      context.updateJson[file] = update({});
    };
    context.copyTemplate = (file, dest, templateScope) => {
      const scope = Object.assign({}, {json}, context.props, templateScope);
      const files = {template: file, destination: ''};
      fileUtils.renameFiles(files, context.props);
      const filePath = path.join('generators/app/templates', files.template);
      const content = fs.read(filePath);
      const rendered = ejs.render(content, scope);
      context.copyTemplate[file] = rendered;
    };
    return context;
  },
  call(context, method, props) {
    Object.assign(context.props, props);
    _.get(context, method).call(context);
  }
};
