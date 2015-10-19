'use strict';

var galvatron = require('galvatron');
var gulp = require('gulp');

galvatron.transformer
  .post('babel')
  .post('globalize');

module.exports = function () {
  var bundle = galvatron.bundle('test/unit.js');

  return gulp.src(bundle.files)
    .pipe(bundle.stream())
    .pipe(gulp.dest('.tmp'));
};
