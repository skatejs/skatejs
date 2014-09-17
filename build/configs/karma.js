module.exports = function (grunt) {
  var browsers = grunt.option('browsers');
  var sauce = grunt.option('sauce');
  var customLaunchers = {
      sl_chrome: {
        base: 'SauceLabs',
        browserName: 'chrome',
        platform: 'Windows 8.1',
        version: '37'
      },
      sl_firefox: {
        base: 'SauceLabs',
        browserName: 'firefox',
        platform: 'Windows 8.1',
        version: '31'
      },
      sl_ie_11: {
        base: 'SauceLabs',
        browserName: 'internet explorer',
        platform: 'Windows 8.1',
        version: '11'
      }
    };

  if (sauce) {
    browsers = Object.keys(customLaunchers);
  } else if (browsers) {
    browsers = browsers.split(',');
  } else {
    browsers = ['Chrome'];
  }

  return {
    options: {
      browsers: browsers,

      customLaunchers: customLaunchers,

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
        'karma-phantomjs-launcher',
        'karma-sauce-launcher'
      ],

      port: grunt.option('port') || '9876',

      reporters: [
        'progress',
        'saucelabs'
      ],

      saucelabs: {
        testName: 'SkateJS Unit Tests'
      },

      singleRun: !grunt.option('keep-alive'),
    },

    unit: {}
  };
};
