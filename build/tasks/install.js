module.exports = function (grunt) {
  'use strict';

  grunt.registerTask('install', 'Ensures everything is set up and ready for dev.', [
    'shell:installBower'
  ]);
};
