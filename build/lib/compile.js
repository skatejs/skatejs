'use strict';

var fs = require('fs');
var sh = require('shelljs');
var path = require('path');

var browserify = require('browserify');
var to5ify = require('6to5ify');

module.exports = function (src, dest, name) {
  sh.mkdir('-p', path.dirname(dest));

  var opts = './' + src + ' -t 6to5ify -o ' + dest;
  sh.exec('./node_modules/.bin/browserify ' + opts);
};
