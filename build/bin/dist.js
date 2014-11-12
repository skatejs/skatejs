'use strict';

var cc = require('closure-compiler');
var compile = require('../lib/compile');
var fs = require('fs');
var sh = require('shelljs');

sh.rm('-rf', 'dist');
compile('src/skate.js', 'dist/skate.js');
cc.compile(fs.readFileSync('dist/skate.js'), {}, function aftercompile (err, stdout, stderr) {
  if (err) {
    throw err;
  }

  fs.writeFileSync('dist/skate.min.js', stdout);
});
