module.exports = function (grunt) {
  'use strict';

  grunt.registerTask('dist', 'Creates the dist files.', [
    'test',
    'shell:dist',
    'uglify:dist'
  ]);
};
