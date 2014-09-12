module.exports = function (grunt) {
  'use strict';

  grunt.registerTask('test', 'Runs tests.', [
    'shell:test',
    'karma:unit'
  ]);
};
