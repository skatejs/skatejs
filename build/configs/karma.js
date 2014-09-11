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
        { pattern: 'test/lib/polyfills.js', included: true },
        { pattern: 'test/*.js', included: true },
        { pattern: 'src/*.js', included: false },
        { pattern: 'test/**/*.js', included: false }
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
        'karma-traceur-preprocessor'
      ],

      port: grunt.option('port') || '9876',

      preprocessors: {
        'src/skate.js': 'traceur'
      },

      singleRun: !grunt.option('watch'),

      traceurPreprocessor: {
        options: {
          modules: 'inline'
        }
      }
    },

    cli: {},

    http: {
      singleRun: false
    }
  };
};
