'use strict';

const _ = require('lodash');
const ejs = require('ejs');
const minimatch = require('minimatch');
const json = require('./json2js').json;

exports.mergeJson = function (fileName, newContent) {
  const content = this.fs.readJSON(this.destinationPath(fileName), {});

  _.mergeWith(content, newContent, (a, b) => {
    if (_.isArray(a)) {
      return _.uniq(a.concat(b));
    }
  });

  this.fs.writeJSON(this.destinationPath(fileName), content);
};

exports.updateJson = function (fileName, update) {
  const content = this.fs.readJSON(this.destinationPath(fileName), {});

  const newContent = update(content);

  this.fs.writeJSON(this.destinationPath(fileName), newContent);
};

exports.replaceInFileWithTemplate = function (templateFileName, destinationFileName, regex, templateScope) {
  const scope = Object.assign({
    extensions: exports.getExtensions(this.options)
  }, this.options, templateScope);

  const originalContent = this.fs.read(this.destinationPath(destinationFileName), {});
  let addContent = this.fs.read(this.templatePath(templateFileName), {});
  addContent = addContent.replace(/([\s\S]*)$/, '$1');
  const processedAddContent = ejs.render(addContent, scope);

  const newContent = originalContent.replace(regex, processedAddContent);

  this.fs.write(this.destinationPath(destinationFileName), newContent);
};

exports.replaceInFiles = function (destinationFiles, transform) {
  this.fs.store.each(file => {
    if (minimatch(file.path, this.destinationPath(destinationFiles))) {
      const originalContent = this.fs.read(file.path, {});
      const newContent = transform(originalContent, file.path);
      this.fs.write(file.path, newContent);
    }
  });
};

exports.getExtensions = function (props) {
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

exports.copyTemplate = function (templateFileName, destinationFileName, templateScope) {
  const scope = Object.assign({}, {
    json,
    version: require('../package.json').version,
    date: new Date().toString(),
    extensions: exports.getExtensions(this.options)
  }, this.options, templateScope);

  const files = {
    template: templateFileName,
    destination: destinationFileName
  };

  exports.renameFiles(files, scope);

  this.fs.copyTpl(
    this.templatePath(files.template),
    this.destinationPath(files.destination),
    scope
  );
};

exports.renameFiles = function (files, props) {
  if (/^src\/[^.].*\.js$/.test(files.template)) {
    if (props.js === 'babel') {
      files.template = files.template.replace(/\.js$/, '.babel');
    }
    if (props.js === 'typescript') {
      let ext = '.ts';
      if (props.framework === 'react') {
        ext = '.tsx';
      }
      files.template = files.template.replace(/\.js$/, ext);
      files.destination = files.destination.replace(/\.js$/, ext);
    }
  }

  if (/^src.*\.css$/.test(files.template)) {
    if (props.css === 'scss') {
      files.template = files.template.replace(/\.css$/, '.scss');
      files.destination = files.destination.replace(/\.css$/, '.scss');
    }
    if (props.css === 'less') {
      files.template = files.template.replace(/\.css$/, '.less');
      files.destination = files.destination.replace(/\.css$/, '.less');
    }
    if (props.css === 'styl') {
      files.template = files.template.replace(/\.css$/, '.styl');
      files.destination = files.destination.replace(/\.css$/, '.styl');
    }
  }
};
