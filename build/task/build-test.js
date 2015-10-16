var galv = require('galvatron');
var gulp = require('gulp');
var gulpBabel = require('gulp-babel');
var gulpConcat = require('gulp-concat');

module.exports = function () {
  return gulp.src('test/unit.js')
    .pipe(galv.trace())
    .pipe(galv.cache('babel', gulpBabel()))
    .pipe(galv.cache('globalize', galv.globalize()))
    .pipe(gulpConcat('unit.js'))
    .pipe(gulp.dest('.tmp'));
};
