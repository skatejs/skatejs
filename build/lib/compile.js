'use strict';

var fs = require('fs');
var sh = require('shelljs');
var path = require('path');

var browserify = require('browserify');
var to5ify = require('6to5ify');
var derequire = require('browserify-derequire');
var exorcist = require('exorcist');

module.exports = function (src, dest, name, cb) {
  sh.mkdir('-p', path.dirname(dest));

  cb = cb || function () {};
  var out = fs.createWriteStream(dest);

  var opts = { debug: true };
  if (name) {
    opts.standalone = name;
  }

  var bundle = browserify(src, opts)
    .transform(to5ify)
    .plugin(derequire)
    .bundle();

  bundle
    .pipe(exorcist(dest + '.map'))
    .pipe(out);

  bundle.on('end', cb);
};
