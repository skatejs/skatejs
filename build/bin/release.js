'use strict';

var replace = require('../lib/replace');
var sh = require('shelljs');
var version = require('../lib/version');

replace('src/version.js', version(), version.next());
replace('bower.json', version(), version.next());
replace('package.json', version(), version.next());
sh.exec('npm test');
sh.exec('npm dist');
sh.exec('git commit -am "' + version() + ' -> ' + version.next() + '"');
sh.exec('git tag -a ' + version.next() + ' -m ' + version.next());
sh.exec('git push');
sh.exec('git push --tags');
sh.exec('npm publish');
