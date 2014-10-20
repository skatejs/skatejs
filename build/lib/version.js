module.exports = function (grunt) {
  return grunt.option('version') ||
    semver.inc(
      curver,
      grunt.option('type') || 'patch'
    );
};
