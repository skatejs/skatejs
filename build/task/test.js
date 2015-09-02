var assign = require('lodash/object/assign');
var galv = require('galvatron');
var gulp = require('gulp');
var gulpBabel = require('gulp-babel');
var gulpConcat = require('gulp-concat');
var gulpDebug = require('gulp-debug');
var gulpKarma = require('gulp-karma');

module.exports = function (opts) {
  opts = assign(opts, {
    action: 'run',
    browsers: ['Chrome', 'Firefox']
  });

  return gulp.src('test/unit.js')
    .pipe(galv.trace())
    .pipe(galv.cache('babel', gulpBabel()))
    .pipe(galv.globalize())
    .pipe(gulpConcat('unit.js'))
    .pipe(gulp.dest('.tmp'))
    .pipe(gulpDebug({ title: 'babel' }))
    .pipe(gulpKarma({
      action: opts.action,
      browsers: opts.browsers,
      frameworks: ['mocha', 'sinon-chai']
    }));
};
