'use strict';

var cmd = require('commander');
var pkg = require('../../package.json');
var replace = require('../lib/replace');
var semver = require('semver');
var sh = require('shelljs');

cmd
  .option('-s, --semver [version]', 'The semantic version to release in lieu of --type. This takes precedence over --type.')
  .option('-t, --type [major, minor or patch]', 'The type of release being performed in lieu of --semver.')
  .parse(process.argv);

module.exports = function () {
  var currentVersion = pkg.version;
  var nextVersion = cmd.semver || semver.inc(
    currentVersion,
    cmd.type || 'patch'
  );

  sh.exec('npm run lint');
  sh.exec('npm run test');
  replace('src/version.js', currentVersion, nextVersion);
  replace('bower.json', currentVersion, nextVersion);
  replace('package.json', currentVersion, nextVersion);
  sh.exec('npm run dist');
  sh.exec('npm run lib');
  sh.exec('git commit -am "' + currentVersion + ' -> ' + nextVersion + '"');
  sh.exec('git tag -a ' + nextVersion + ' -m ' + nextVersion);
  sh.exec('git push');
  sh.exec('git push --tags');
  sh.exec('npm publish');
};
