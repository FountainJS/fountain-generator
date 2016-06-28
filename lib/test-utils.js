const _ = require('lodash');
const memFs = require('mem-fs');
const editor = require('mem-fs-editor');
const ejs = require('ejs');
const path = require('path');
const json = require('./json2js').json;
const fileUtils = require('./file-utils');
const nodeFs = require('fs');

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
      context.updateJson[file] = update(context.updateJson[file]);
    };
    context.copyTemplate = (file, dest, templateScope) => {
      const scope = Object.assign({}, {json}, context.options, templateScope);
      const files = {template: file, destination: ''};
      fileUtils.renameFiles(files, context.options);
      const filePath = path.join(`generators/${generator}/templates`, files.template);
      if (filePath.match(/^.*\.[^\\]+$/)) {
        const content = fs.read(filePath).replace(/<% include (.*) %>(\n)+/g, (match, p1) => {
          const prefix = filePath.match(/(.*)\//);
          const include = fs.read(`${prefix[0]}${p1}`);
          return include;
        });
        const rendered = ejs.render(content, scope);
        context.copyTemplate[dest] = rendered;
      } else {
        nodeFs.readdirSync(filePath).forEach(file => {
          const path = `${filePath.match(/[^\/]*$/)}/${file}`;
          context.copyTemplate(path, path, templateScope);
        });
      }
    };
    context.replaceInFiles = (destinationFiles, transform) => {
      for (const key in context.copyTemplate) {
        if (key.match(/.*(js|tsx|.ts)/)) {
          const originalContent = fs.read(key, {});
          const newContent = transform(originalContent, key);
          context.copyTemplate[key] = newContent;
        }
      }
    };
    context.getExtensions = props => {
      const extensions = {
        js: 'ts',
        css: 'less'
      };
      if (props.framework === 'react') {
        extensions.js = props.js === 'typescript' ? 'tsx' : 'js';
      } else {
        extensions.js = props.js === 'typescript' ? 'ts' : 'js';
      }
      extensions.css = props.css;
      return extensions;
    };
    return context;
  },
  call(context, method, options) {
    Object.assign(context.options, options);
    return _.get(context, method).call(context);
  }
};
