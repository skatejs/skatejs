/**
 * Overwritten karma.conf.js
 * includes karma-typescript-preprocessor
 */

const cwd = process.cwd();
const path = require('path');
const browsers = require(path.join(cwd, 'karma.browsers'));
// const webpackConfig = require(path.join(cwd, 'webpack.config'));
const webpackConfig = require('./webpack.config');

module.exports = function (config) {
  // list of files / patterns to load in the browser
  // all dependancies should be traced through here
  let files = ['test/unit.js'];

  // preprocess matching files before serving them to the browser
  // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
  // webpack will trace and watch all dependancies
  let preprocessors = {
    '**/*.ts': ['typescript'],
    'test/unit.js': ['webpack', 'sourcemap']
  };

  if (process.argv.indexOf('--perf') > -1) {
    files = ['test/perf.js'];
    preprocessors = {
      'test/perf.js': ['webpack', 'sourcemap']
    };
  }

  config.set(Object.assign({
    // base path that will be used to resolve all patterns (eg. files, exclude)
    // setting to process.cwd will make all paths start in current component directory
    basePath: process.cwd(),

    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['mocha', 'chai', 'sinon-chai'],

    // list of files / patterns to load in the browser
    files,

    // list of files to exclude
    exclude: [],

    // list of preprocessors
    preprocessors,

    typescriptPreprocessor: {
      // options passed to the typescript compiler
      options: {
        sourceMap: false, // (optional) Generates corresponding .map file.
        target: 'ES5', // (optional) Specify ECMAScript target version: 'ES3' (default), or 'ES5'
        module: 'commonjs', // (optional) Specify module code generation: 'commonjs' or 'amd'
        noImplicitAny: true, // (optional) Warn on expressions and declarations with an implied 'any' type.
        noResolve: true, // (optional) Skip resolution and preprocessing.
        removeComments: false, // (optional) Do not emit comments to output.
        concatenateOutput: false // (optional) Concatenate and emit output to single file. By default true if module option is omited, otherwise false.
      },
      // transforming the filenames
      transformPath: function (path) {
        return path.replace(/\.ts$/, '.js');
      }
    },

    // Ensure mobile browsers have enough time to run.
    browserNoActivityTimeout: 60000,

    // karma watches the test entry points
    // (you don't need to specify the entry option)
    // webpack watches dependencies
    webpack: Object.assign({}, webpackConfig, {
      devtool: 'inline-source-map',
      entry: undefined
    }),

    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['progress'],

    // web server port
    port: 9876,

    // enable / disable colors in the output (reporters and logs)
    colors: true,

    // level of logging
    // possible values: LOG_DISABLE, LOG_ERROR, LOG_WARN, LOG_INFO, LOG_DEBUG
    logLevel: config.LOG_INFO,

    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,

    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['Firefox'],

    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false,

    // Concurrency level
    // how many browser should be started simultaneous
    concurrency: Infinity
  }, process.argv.indexOf('--all') === -1 ? {} : {
    sauceLabs: {},
    customLaunchers: browsers,
    browsers: Object.keys(browsers),
    retryLimit: 3,
    reporters: ['dots', 'saucelabs'],
    autoWatch: false,
    concurrency: 4,

    // to avoid DISCONNECTED messages when connecting to Testingbot
    browserDisconnectTimeout: 10000,
    browserDisconnectTolerance: 5,
    captureTimeout: 120000
  }));
};
