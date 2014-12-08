'use strict';

var sh = require('shelljs');

sh.exec('npm run docs');
sh.rm('-rf', '.tmp');
sh.mkdir('-p', '.tmp');
sh.cd('.tmp');
sh.exec('git clone git@github.com:skatejs/skatejs.github.io .');
sh.exec('ls -a1 | grep -v "^\\.git$" | grep -v "^\\.$" | grep -v "^\\.\\.$" | xargs rm -rf');
sh.cp('-rf', '../docs/build/*', './');
sh.exec('git add .');
sh.exec('git commit -am "Update documentation."');
sh.exec('git push');
sh.cd('..');
sh.rm('-rf', '.tmp');
