module.exports = function (grunt) {
  var curver = require('../../package.json').version;
  var semver = require('semver');
  var version = grunt.option('version');

  function bump () {
    return version ? version : semver.inc(curver);
  }

  function file (path) {
    return {
      dest: path,
      src: path
    };
  }

  return {
    release: {
      options: {
        patterns: [
          {
            match: new RegExp(curver),
            replacement: bump
          }
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
