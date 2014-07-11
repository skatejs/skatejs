module.exports = function (grunt) {
  var browsers = grunt.option('browsers');

  if (browsers) {
    browsers = browsers.split(',');
  } else {
    browsers = ['PhantomJS'];
  }

  return {
    options: {
      hostname: grunt.option('host') || 'localhost',
      port: grunt.option('port') || '9876',
      browsers: browsers,
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
        'karma-chrome-launcher',
        'karma-firefox-launcher',
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
