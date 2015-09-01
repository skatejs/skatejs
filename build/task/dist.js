var galv = require('galvatron');
var gulp = require('gulp');
var gulpBabel = require('gulp-babel');
var gulpConcat = require('gulp-concat');
var gulpDebug = require('gulp-debug');
var gulpFilter = require('gulp-filter');
var gulpUglify = require('gulp-uglify');

module.exports = function () {
  var filterOutGlobalJs = gulpFilter('!src/global.js', { restore: true });
  return gulp.src('src/global.js')
    .pipe(gulpDebug({ title: 'trace' }))
    .pipe(galv.trace())
    .pipe(gulpBabel())
    .pipe(galv.globalize())

    // dist
    .pipe(gulpConcat('skate.js'))
    .pipe(gulp.dest('dist'))
    .pipe(gulpUglify())
    .pipe(gulpConcat('skate.min.js'))
    .pipe(gulp.dest('dist'))
    .pipe(gulpDebug({ title: 'js' }))

    // lib
    .pipe(filterOutGlobalJs)
    .pipe(gulp.dest('lib'));
};
