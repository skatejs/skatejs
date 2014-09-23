module.exports = function (grunt) {
  'use strict';

  var browsers = grunt.option('browsers');
  var keepalive = grunt.option('keepalive');

  if (!keepalive) {
    if (browsers) {
      browsers = browsers.split(',');
    } else {
      browsers = ['SlimerJS'];
    }
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
        'karma-slimerjs-launcher'
      ],

      port: grunt.option('port') || '9876',

      reporters: [
        'progress'
      ],

      singleRun: !keepalive
    },

    unit: {}
  };
};
