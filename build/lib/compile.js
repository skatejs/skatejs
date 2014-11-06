'use strict';

var path = require('path');
var sh = require('shelljs');

module.exports = function (src, dest) {
  var base = '.tmp/6to5/' + path.dirname(src);

  sh.rm('-rf', base);
  sh.mkdir('-p', base);
  sh.exec('./node_modules/.bin/6to5 ' + path.dirname(src) + ' --out-dir ' + base);

  if (dest) {
    sh.mkdir('-p', path.dirname(dest));
    sh.exec('./node_modules/.bin/browserify .tmp/6to5/' + src + ' -o ' + dest);
  }
};
