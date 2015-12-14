const _ = require('lodash');
const ejs = require('ejs');

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
