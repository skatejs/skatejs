module.exports = function(grunt) {

  'use strict';

  var host = grunt.option('host') || 'localhost';

  grunt.loadNpmTasks('grunt-contrib');
  grunt.loadNpmTasks('grunt-karma');

  grunt.initConfig({
    concat: {
      all: {
        files: {
          'dist/skate.js': [
            'src/skate.js'
          ]
        }
      }
    },
    connect: {
      docs: {
        options: {
          keepalive: true,
          hostname: host,
          open: 'http://' + host + ':8000/docs'
        }
      }
    },
    karma: {
      options: {
        hostname: grunt.option('host') || 'localhost',
        port: grunt.option('port') || 9876,
        browsers: [grunt.option('browser') || 'PhantomJS'],
        files: [
          'src/skate.js',
          'tests/polyfills.js',
          'tests/skate.js'
        ],
        frameworks: ['mocha', 'sinon-chai'],
        singleRun: !grunt.option('host')
      },
      all: {
        options: {
          browsers: ['Chrome', 'Firefox', 'PhantomJS']
        }
      },
      phantomjs: {}
    },
    uglify: {
      all: {
        files: {
          'dist/skate.min.js': 'dist/skate.js'
        }
      }
    },
    watch: {
      test: {
        files: ['src/*.js'],
        tasks: ['dist']
      }
    }
  });

  grunt.registerTask('build', 'Runs the tests and builds the dist.', ['dist', 'test']);
  grunt.registerTask('dist', 'Builds the dist.', ['concat', 'uglify']);
  grunt.registerTask('docs', 'Runs the docs server.', ['connect:docs'])
  grunt.registerTask('test', 'Runs the tests.', ['karma:phantomjs']);

};
