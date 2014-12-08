'use strict';

var cmd = require('commander');
var pkg = require('../../package.json');
var replace = require('../lib/replace');
var semver = require('semver');
var sh = require('shelljs');

cmd
  .option('-v, --version [version]', 'The version to release in lieu of --type.')
  .option('-t, --type [major, minor or patch]', 'The type of release being performed.')
  .parse(process.argv);

var currentVersion = pkg.version;
var nextVersion = semver.inc(
  currentVersion,
  cmd.type || 'patch'
);

sh.exec('npm run test');
sh.exec('npm run dist');
replace('src/version.js', currentVersion, nextVersion);
replace('bower.json', currentVersion, nextVersion);
replace('package.json', currentVersion, nextVersion);
sh.exec('git commit -am "' + currentVersion + ' -> ' + nextVersion + '"');
sh.exec('git tag -a ' + nextVersion + ' -m ' + nextVersion);
sh.exec('git push');
sh.exec('git push --tags');
sh.exec('npm publish');
