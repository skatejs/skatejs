'use strict';

var semver = require('semver');

function version () {
  return require('../../package.json').version;
}

module.exports = function () {
  var cmd = require('commander')
    .option('-v', '--version [version]', 'The version to release in lieu of --type.')
    .option('-t', '--type [major, minor or patch]', 'The type of release being performed.')
    .parse(process.argv);

  version.next = function () {
    return cmd.version ||
      semver.inc(
        version(),
        cmd.type || 'patch'
      );
  };

  return version;
};
