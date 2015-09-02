var build = require('./build');
var galv = require('galvatron');
var gulp = require('gulp');
var gulpWebserver = require('gulp-webserver');

module.exports = function () {
  galv.watch('docs/**', build).on('end', function () {
    gulp.src('.tmp/docs').pipe(gulpWebserver({
      host: '*',
      livereload: false,
      open: true
    }));
  });
};
