'use strict';

var galvatron = require('galvatron')();
var gulp = require('gulp');
var path = require('path');

galvatron.transformer.post('babel', {
  modules: 'umd'
});

module.exports = function () {
  var bundle = galvatron.bundle('src/skate.js');
  var src = path.join(process.cwd(), 'src');
  bundle.all.forEach(function (file) {
    var srcFile = path.relative(src, file);
    var destFile = path.join('lib', srcFile);
    var destDir = path.dirname(destFile);
    gulp
      .src(file)
      .pipe(bundle.streamOne())
      .pipe(gulp.dest(destDir));
  });
};
