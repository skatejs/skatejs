'use strict';

var commander = require('../lib/commander');
var galvatron = require('galvatron')();
var gulp = require('gulp');
var gulpRename = require('gulp-rename');
var gulpUglify = require('gulp-uglify');

galvatron.transformer
  .post('babel')
  .post('globalize');

module.exports = function () {
  var bundle = galvatron.bundle('src/skate.js');
  return gulp
    .src(bundle.files)
    .pipe(bundle.watchIf(commander.watch))
    .pipe(bundle.stream())
    .pipe(gulp.dest('dist'))
    .pipe(gulpUglify())
    .pipe(gulpRename( { basename: 'skate.min' }))
    .pipe(gulp.dest('dist'));
};
