module.exports = function (grunt) {
  var semver = require('semver');

  function version () {
    return require('../../package.json').version;
  }

  version.next = function (type) {
    return grunt.option('tag') ||
      semver.inc(
        version(),
        grunt.option('type') || 'patch'
      );
  };

  return version;
};
