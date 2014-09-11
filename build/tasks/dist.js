module.exports = function (grunt) {
  'use strict';

  grunt.registerTask('dist', 'Creates the dist files.', [
    'karma:cli',
    'shell:dist',
    'uglify:dist'
  ]);
};
