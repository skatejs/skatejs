module.exports = function (grunt) {
  'use strict';

  grunt.registerTask('lint', 'Runs JSHint and JSCS.' [
    'jshint',
    'jscs'
  ]);
};
