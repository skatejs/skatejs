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
        { pattern: 'test/lib/polyfills.js', included: true },
        { pattern: 'test/unit.js', included: true },
        { pattern: 'src/*.js', included: false },
        { pattern: 'test/**/*.js', included: false }
      ],
      frameworks: [
        'requirejs',
        'mocha',
        'chai'
      ],
      plugins: [
        'karma-chai',
        'karma-chrome-launcher',
        'karma-firefox-launcher',
        'karma-mocha',
        'karma-phantomjs-launcher',
        'karma-requirejs'
      ],
      singleRun: !grunt.option('watch')
    },
    cli: {},
    http: {
      singleRun: false
    }
  };
};
