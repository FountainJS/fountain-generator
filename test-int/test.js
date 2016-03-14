const helper = require('./helper');

describe('fountain integration test', function() {
  this.timeout(0);

  const frameworks = ['react', 'angular1', 'angular2'];
  const modules = ['webpack', 'systemjs', 'inject'];
  const jss = ['babel', 'js', 'typescript'];

  frameworks.forEach(framework => {
    modules.forEach(module => {
      jss.forEach(js => {
        const options = {
          framework,
          modules: module,
          css: 'sass',
          js,
          sample: 'techs'
        };

        it(`should work with ${framework}, ${module}, ${js}`, function (done) {
          helper.run(options, function(result) {
            expect(result).toBe(0);
            done();
          });
        });
      });
    });
  });
});
