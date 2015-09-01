var galv = require('galvatron');
var gulp = require('gulp');
var gulpBabel = require('gulp-babel');
var gulpKarma = require('gulp-karma');

module.exports = function (opts) {
  return gulp.src('test/unit.js')
    .pipe(galv.trace())
    .pipe(galv.cache('babel', gulpBabel()))
    .pipe(gulpKarma({
      action: opts.watch ? 'watch' : 'run'
    }));
};
