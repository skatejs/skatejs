var galv = require('galvatron');
var gulp = require('gulp');
var gulpBabel = require('gulp-babel');
var gulpConcat = require('gulp-concat');
var gulpFilter = require('gulp-filter');

module.exports = function () {
  var filterEverythingExceptWebcomponents = gulpFilter(['**/*','!**/webcomponents.js/**/*'], { restore: true });

  return gulp.src('test/unit.js')
    .pipe(galv.trace())
    .pipe(filterEverythingExceptWebcomponents)
    .pipe(galv.cache('babel', gulpBabel()))
    .pipe(filterEverythingExceptWebcomponents.restore)
    .pipe(galv.cache('globalize', galv.globalize()))
    .pipe(gulpConcat('unit.js'))
    .pipe(gulp.dest('.tmp'));
};
