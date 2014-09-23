module.exports = function (grunt) {
  'use strict';

  function launcher (platform, browser, version) {
    var device = '';

    if (browser === 'iphone') {
      device = 'iPhone';
    }

    if (browser === 'android') {
      device = 'Android';
    }

    return {
      base: 'SauceLabs',
      platform: platform,
      browserName: browser,
      version: version && version.toString() || ''
    };
  }

  var browsers = grunt.option('browsers');
  var sauce = grunt.option('sauce');
  var customLaunchers = {
      'Chrome 37': launcher('Windows 8.1', 'chrome', 37),
      'Chrome 36': launcher('Windows 8.1', 'chrome', 36),

      'Firefox 32': launcher('Windows 8.1', 'firefox', 32),
      'Firefox 31': launcher('Windows 8.1', 'firefox', 31),

      'Safari 7': launcher('OS X 10.9', 'safari', 7),
      'Safari 6': launcher('OS X 10.8', 'safari', 6),

      'iOS Safari 7.1': launcher('OS X 10.9', 'iphone', 7.1),
      'iOS Safari 7': launcher('OS X 10.9', 'iphone', 7),
      'iOS Safari 6.1': launcher('OS X 10.8', 'iphone', 6.1),
      'iOS Safari 6': launcher('OS X 10.8', 'iphone', 6),

      'IE 11': launcher('Windows 8.1', 'internet explorer', 11),
      'IE 10': launcher('Windows 8', 'internet explorer', 10),
      'IE 9': launcher('Windows 7', 'internet explorer', 9)
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
