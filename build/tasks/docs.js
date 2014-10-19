module.exports = function (grunt) {
  'use strict';

  var metalsmith = require('metalsmith');
  var markdown = require('metalsmith-markdown');
  var templates = require('metalsmith-templates');

  grunt.registerTask('docs', 'Generates the documentation.', function () {
    metalsmith('docs')
      .use(markdown())
      .use(templates('handlebars'))
      .build(this.async());

    grunt.task.run([
      'clean:docs',
      'less:docs',
      'shell:docs'
    ]);
  });
};
