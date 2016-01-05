'use strict';

const _ = require('lodash');
const ejs = require('ejs');
const json = require('./json2js').json;

exports.mergeJson = function mergeJson(fileName, newContent) {
  const content = this.fs.readJSON(this.destinationPath(fileName), {});

  _.merge(content, newContent, (a, b) => {
    if (_.isArray(a)) {
      return _.uniq(a.concat(b));
    }
  });

  this.fs.writeJSON(this.destinationPath(fileName), content);
};

exports.updateJson = function mergeJson(fileName, update) {
  const content = this.fs.readJSON(this.destinationPath(fileName), {});

  const newContent = update(content);

  this.fs.writeJSON(this.destinationPath(fileName), newContent);
};

exports.replaceInFile = function replaceInFile(templateFileName, destinationFileName, regex, templateScope) {
  const scope = Object.assign({}, this.props, templateScope);

  const originalContent = this.fs.read(this.destinationPath(destinationFileName), {});
  let addContent = this.fs.read(this.templatePath(templateFileName), {});
  addContent = addContent.replace(/([\s\S]*)\n$/, '$1');
  const processedAddContent = ejs.render(addContent, scope);

  const newContent = originalContent.replace(regex, processedAddContent);

  this.fs.write(this.destinationPath(destinationFileName), newContent);
};

exports.copyTemplate = function copyTemplate(templateFileName, destinationFileName, templateScope) {
  const scope = Object.assign({}, { json }, this.props, templateScope);

  const files = {
    template: templateFileName,
    destination: destinationFileName
  };

  exports.renameFiles(files, this.props);

  this.fs.copyTpl(
    this.templatePath(files.template),
    this.destinationPath(files.destination),
    scope
  );
};

exports.renameFiles = function renameFiles(files, props) {
  if (/^src.*\.js$/.test(files.template)) {
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
  }
};
