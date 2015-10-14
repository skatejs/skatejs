var galv = require('galvatron');
var gulp = require('gulp');
var gulpBabel = require('gulp-babel');
var gulpConcat = require('gulp-concat');
var gulpDebug = require('gulp-debug');
var gulpRename = require('gulp-rename');
var gulpUglify = require('gulp-uglify');
var merge = require('merge-stream');

function task () {
  merge(
    gulp.src('src/global.js')
      .pipe(gulpDebug({ title: 'trace' }))
      .pipe(galv.trace())
      .pipe(galv.cache('babel', gulpBabel()))
      .pipe(galv.cache('globalize', galv.globalize()))
      .pipe(galv.cache('concat', gulpConcat('skate.js')))
      .pipe(gulp.dest('dist'))
      .pipe(galv.cache('uglify', gulpUglify()))
      .pipe(gulpConcat('skate.min.js'))
      .pipe(gulp.dest('dist'))
      .pipe(gulpDebug({ title: 'dist' })),
    gulp.src('src/index.js')
      .pipe(gulpDebug({ title: 'trace' }))
      .pipe(galv.trace())
      .pipe(galv.cache('babel-umd', gulpBabel({ modules: 'umd' })))
      .pipe(gulpRename(function (path) {
        path.dirname = path.dirname.replace(/^src/, '.');
      }))
      .pipe(gulp.dest('lib'))
      .pipe(gulpDebug({ title: 'lib' }))
  );
}
task.dependencies = ['./clean'];
module.exports = task;
