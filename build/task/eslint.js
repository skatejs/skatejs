var gulp = require('gulp');
var eslint = require('gulp-eslint');

module.exports = function () {
  return gulp.src(['test/**/*.js', 'src/**/*.js', 'build/**/*.js'])
      .pipe(eslint())
      .pipe(eslint.format())
      .pipe(eslint.failAfterError());
};
