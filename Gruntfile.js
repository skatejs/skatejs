module.exports = function(grunt) {

  'use strict';

  grunt.loadNpmTasks('grunt-contrib');
  grunt.loadNpmTasks('grunt-karma');
  grunt.loadNpmTasks('grunt-traceur');

  grunt.initConfig({
    karma: {
      all: {
        options: {
          browsers: ['PhantomJS'],
          files: [
            'dist/skate.js',
            'tests/skate.js'
          ],
          frameworks: ['mocha', 'sinon-chai'],
          singleRun: true
        }
      }
    },
    traceur: {
      options: {
        blockBinding: true
      },
      all: {
        files: {
          'dist/skate.js': 'src/skate.js'
        }
      }
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
        tasks: ['test']
      }
    }
  });

  grunt.registerTask('build', 'Runs the tests and builds the dist.', ['test']);
  grunt.registerTask('dist', 'Builds the dist.', ['traceur', 'uglify']);
  grunt.registerTask('test', 'Runs the tests.', ['dist', 'karma']);

};
