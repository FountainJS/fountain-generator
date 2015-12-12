var _ = require('lodash');
var ejs = require('ejs');

exports.mergeJson = function mergeJson(fileName, newContent) {
  var content = this.fs.readJSON(this.destinationPath(fileName), {});

  _.merge(content, newContent, function (a, b) {
    if (_.isArray(a)) {
      return _.uniq(a.concat(b));
    }
  });

  this.fs.writeJSON(this.destinationPath(fileName), content);
};

exports.updateJson = function mergeJson(fileName, update) {
  var content = this.fs.readJSON(this.destinationPath(fileName), {});

  var newContent = update(content);

  this.fs.writeJSON(this.destinationPath(fileName), newContent);
};

exports.replaceInFile = function replaceInFile(fileName, regex, templateScope) {
  var originalContent = this.fs.read(this.destinationPath(fileName), {});
  var addContent = this.fs.read(this.templatePath(fileName), {});
  var processedAddContent = ejs.render(addContent, templateScope);

  var newContent = originalContent.replace(regex, processedAddContent);

  this.fs.write(this.destinationPath(fileName), newContent);
};
