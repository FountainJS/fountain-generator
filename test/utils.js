const path = require('path');
const fs = require('fs-extra');

module.exports = {
  defaults() {
    return {fs: {}, writeJSON: {}, write: {}, copyTpl: {}};
  },
  mock(options) {
    const context = Object.assign({}, this.defaults(), options);
    context.fs.writeJSON = (file, content) => {
      context.writeJSON[file] = content;
    };
    context.fs.write = (file, content) => {
      context.write[file] = content;
    };
    context.fs.copyTpl = (template, destination) => {
      context.copyTpl[destination] = fs.readFileSync(template, 'utf8');
    };
    const each = cb => fs.readdirSync(path.join(__dirname, 'assets'))
      .map(fileName => {
        const fullPath = context.templatePath(path.join('assets', fileName));
        return {path: fullPath, content: fs.readFileSync(fullPath, 'utf8')};
      })
      .forEach(file => cb(file));
    context.fs.store = Object.assign({}, {each});
    context.fs.read = file => fs.readFileSync(file, 'utf8');
    context.fs.readJSON = file => fs.readJsonSync(file, {throws: false});
    context.templatePath = file => path.join(__dirname, file);
    context.destinationPath = file => path.join(__dirname, file);
    return context;
  }
};
