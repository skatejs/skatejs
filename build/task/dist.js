'use strict';

var commander = require('../lib/commander');
var del = require('del');
var galvatron = require('galvatron')();
var gulp = require('gulp');
var gulpRename = require('gulp-rename');
var gulpUglify = require('gulp-uglify');
var mac = require('../lib/mac');
var pkg = require('../lib/package');

galvatron.transformer
  .post('babel')
  .post('globalize');

module.exports = mac.series(
  function (done) {
    del('dist', done);
  },

  function () {
    var bundle = galvatron.bundle('src/global.js');
    return gulp
      .src(bundle.files)
      .pipe(bundle.watchIf(commander.watch))
      .pipe(bundle.stream())
      .pipe(gulpRename( { basename: pkg.name }))
      .pipe(gulp.dest('dist'))
      .pipe(gulpUglify())
      .pipe(gulpRename( { suffix: '.min' }))
      .pipe(gulp.dest('dist'));
  }
);
