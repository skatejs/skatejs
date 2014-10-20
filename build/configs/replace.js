module.exports = function (grunt) {
  var semver = require('semver');
  var version = grunt.option('version');

  function bump () {
    console.log(arguments);
  }

  function pattern (find) {
    return {
      match: find,
      replacement: bump
    };
  }

  return {
    release: {
      options: {
        patterns: [
          pattern('version: \'([^\']+)\';'),
          pattern('"version": "([^\']+)"')
        ]
      },
      files: [
        'src/version.js',
        'bower.json',
        'package.json'
      ]
    }
  };
};
