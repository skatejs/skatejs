module.exports = function (grunt) {
  return {
    options: {
      hostname: grunt.option('host') || 'localhost',
      port: grunt.option('port') || '9876',
      browsers: ['PhantomJS'],
      files: [
        'src/skate.js',
        'test/polyfills.js',
        'test/skate.js'
      ],
      frameworks: [
        'chai',
        'mocha'
      ],
      plugins: [
        'karma-chai',
        'karma-mocha',
        'karma-phantomjs-launcher'
      ],
      singleRun: !grunt.option('watch')
    },
    cli: {},
    http: {
      singleRun: false
    }
  };
};
