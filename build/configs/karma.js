module.exports = function (grunt) {
  var browsers = grunt.option('browsers');

  if (browsers) {
    browsers = browsers.split(',');
  } else {
    browsers = ['PhantomJS'];
  }

  return {
    options: {
      browsers: browsers,

      files: [
        { pattern: '.tmp/run-unit-tests.js', included: true }
      ],

      frameworks: [
        'mocha',
        'chai'
      ],

      hostname: grunt.option('host') || 'localhost',

      plugins: [
        'karma-chai',
        'karma-chrome-launcher',
        'karma-firefox-launcher',
        'karma-mocha',
        'karma-phantomjs-launcher'
      ],

      port: grunt.option('port') || '9876',

      singleRun: !grunt.option('keep-alive'),
    },

    unit: {}
  };
};
