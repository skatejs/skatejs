var assign = require('lodash/object/assign');
var galv = require('galvatron');
var gulp = require('gulp');
var gulpBabel = require('gulp-babel');
var gulpConcat = require('gulp-concat');
var gulpFilter = require('gulp-filter');
var gulpKarma = require('gulp-karma');

var benchFilter = gulpFilter(['**', '!**/benchmark.js'], { restore: true });

module.exports = function (opts) {
  var args = [];
  opts = assign({
    browsers: 'Firefox'
  }, opts);

  if (opts.grep) {
    args.push('--grep');
    args.push(opts.grep);
  }

  return gulp.src(['node_modules/benchmark/benchmark.js', 'test/perf.js'])
    .pipe(galv.trace())
    .pipe(benchFilter)
    .pipe(galv.cache('babel', gulpBabel()))
    .pipe(galv.cache('globalize', galv.globalize()))
    .pipe(gulpConcat('perf.js'))
    .pipe(gulp.dest('.tmp'))
    .pipe(benchFilter.restore)
    .pipe(gulpKarma({
      autoWatch: opts.watch,
      browserNoActivityTimeout: 1000000,
      browsers: opts.browsers.split(','),
      client: { args: args },
      frameworks: ['mocha', 'sinon-chai']
    }));
};
