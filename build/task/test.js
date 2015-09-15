var assign = require('lodash/object/assign');
var galv = require('galvatron');
var gulp = require('gulp');
var gulpBabel = require('gulp-babel');
var gulpConcat = require('gulp-concat');
var gulpKarma = require('gulp-karma');

module.exports = function (opts) {
  var args = [];
  opts = assign({
    browsers: 'Firefox'
  }, opts);

  if (opts.grep) {
    args.push('--grep');
    args.push(opts.grep);
  }

  return gulp.src('test/unit.js')
    .pipe(galv.trace())
    .pipe(galv.cache('babel', gulpBabel()))
    .pipe(galv.cache('globalize', galv.globalize()))
    .pipe(gulpConcat('unit.js'))
    .pipe(gulp.dest('.tmp'))
    .pipe(gulpKarma({
      autoWatch: opts.watch,
      browsers: opts.browsers.split(','),
      client: { args: args },
      frameworks: ['mocha', 'sinon-chai']
    }));
};
