var build = require('./build');
var galv = require('galvatron');
var gulp = require('gulp');
var gulpWebserver = require('gulp-webserver');

module.exports = function () {
  galv.watch('src/**', build).on('end', function () {
    gulp.src('dist').pipe(gulpWebserver({
      host: '0.0.0.0',
      livereload: true,
      open: true
    }));
  });
};
