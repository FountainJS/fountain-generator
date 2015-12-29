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

exports.replaceInFile = function replaceInFile(fileName, regex, templateScope) {
  const originalContent = this.fs.read(this.destinationPath(fileName), {});
  const addContent = this.fs.read(this.templatePath(fileName), {});
  const processedAddContent = ejs.render(addContent, templateScope);

  const newContent = originalContent.replace(regex, processedAddContent);

  this.fs.write(this.destinationPath(fileName), newContent);
};

exports.copyTemplate = function copyTemplate(templateFileName, destinationFileName, model) {
  if (/^src.*\.js$/.test(templateFileName)) {
    if (this.props.js === 'babel') {
      templateFileName = templateFileName.replace(/\.js$/, '.babel');
    }
    if (this.props.js === 'typescript') {
      templateFileName = templateFileName.replace(/\.js$/, '.ts');
      destinationFileName = destinationFileName.replace(/\.js$/, '.ts');
    }
  }

  if (/^src.*\.css$/.test(templateFileName)) {
    if (this.props.css === 'scss') {
      templateFileName = templateFileName.replace(/\.css$/, '.scss');
      destinationFileName = destinationFileName.replace(/\.css$/, '.scss');
    }
    if (this.props.css === 'less') {
      templateFileName = templateFileName.replace(/\.css$/, '.less');
      destinationFileName = destinationFileName.replace(/\.css$/, '.less');
    }
  }

  this.fs.copyTpl(
    this.templatePath(templateFileName),
    this.destinationPath(destinationFileName),
    Object.assign({}, { json }, model, this.props)
  );
};
