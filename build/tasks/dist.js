module.exports = function (grunt) {
  'use strict';

  grunt.registerTask('dist', 'Creates the dist files.', [
    'shell:dist',
    'uglify:dist'
  ]);
};
