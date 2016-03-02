const helpers = require('yeoman-test');
const spawn = require('cross-spawn');

exports.run = function run(prompts, callback) {
  process.chdir(__dirname);

  const fountain = helpers.createGenerator('fountain-webapp:app', [
    '../../generator-fountain-webapp/generators/app'
  ], null, { skipInstall: true });

  helpers.mockPrompt(fountain, prompts);

  helpers.testDirectory('work', function() {
    fountain.run(function() {
      const install = spawn('npm-cache', ['install'], { stdio: 'inherit' });
      install.on('exit', function(returnCode) {
        const test = spawn('gulp', ['test'], { stdio: 'inherit' });
        test.on('exit', function(returnCode) {
          callback(returnCode);
        });
      });
    });
  });
};
