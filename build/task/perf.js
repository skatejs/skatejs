var assign = require('lodash/object/assign');
var galv = require('galvatron');
var gulp = require('gulp');
var gulpBabel = require('gulp-babel');
var gulpConcat = require('gulp-concat');
var gulpKarma = require('gulp-karma');

module.exports = function (opts) {
  opts = assign(opts, {
    browsers: ['Chrome', 'Firefox']
  });

  return gulp.src('test/perf.js')
    .pipe(galv.trace())
    .pipe(galv.cache('babel', gulpBabel()))
    .pipe(galv.cache('globalize', galv.globalize()))
    .pipe(gulpConcat('perf.js'))
    .pipe(gulp.dest('.tmp'))
    .pipe(gulpKarma({
      browsers: opts.browsers,
      frameworks: ['mocha', 'sinon-chai']
    }));
};
