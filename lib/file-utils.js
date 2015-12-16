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

function Literal(content) {
  this.content = content;
}

exports.lit = function lit(string) {
  return new Literal(string[0]);
};

function replacer(key, value) {
  if (value instanceof Literal) {
    return `lit>>${value.content}<<lit`;
  } else {
    return value;
  }
}

function json(value) {
  return JSON.stringify(value, replacer, 2).replace(/"lit>>([^"]*)<<lit"/g, '$1');
}

exports.copyTemplate = function copyTemplate(fileName, model) {
  this.fs.copyTpl(
    this.templatePath(fileName),
    this.destinationPath(fileName),
    Object.assign({}, { json }, model)
  );
};
