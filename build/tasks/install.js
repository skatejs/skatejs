module.exports = function (grunt) {
  grunt.registerTask('install', 'Ensures everything is set up and ready for dev.', [
    'shell:installBower',
    'shell:installTraceur'
  ]);
};
