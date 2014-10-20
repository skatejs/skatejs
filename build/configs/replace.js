module.exports = function (grunt) {
  var semver = require('semver');
  var version = grunt.option('version');

  function bump () {
    //console.log(arguments[0][0]);
  }

  function file (path) {
    return {
      dest: path,
      src: path
    };
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
          pattern(/version: '([^\']+)';/),
          pattern(/"version": "([^\']+)"/)
        ]
      },
      files: [
        file('src/version.js'),
        file('bower.json'),
        file('package.json')
      ]
    }
  };
};
