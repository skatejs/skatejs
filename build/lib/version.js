module.exports = function (grunt) {
  var semver = require('semver');

  function version () {
    return require('../../package.json').version;
  }

  version.next = function (type) {
    return grunt.option('version') ||
      semver.inc(
        version(),
        grunt.option('type') || 'patch'
      );
  };

  return version;
};
