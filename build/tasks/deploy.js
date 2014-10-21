module.exports = function (grunt) {
  grunt.registerTask('deploy', 'Deploys the documentation.', [
    'docs',
    'shell:deploy'
  ]);
};
