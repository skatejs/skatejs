'use strict';

var del = require('del');
var galv = require('galvatron');
var gulp = require('gulp');
var gulpLess = require('gulp-less');
var mac = require('mac');
var metalsmith = require('metalsmith');
var metalsmithMarkdown = require('metalsmith-markdown');
var metalsmithTemplates = require('metalsmith-templates');

module.exports = function () {
  return mac.series(
    function (done) {
      metalsmith('docs')
        .use(metalsmithMarkdown())
        .use(metalsmithTemplates('handlebars'))
        .build(done);
    },

    function (done) {
      del('docs/build/styles', done);
    },

    function () {
      return gulp
        .src('docs/src/styles/index.less')
        .pipe(gulpLess())
        .pipe(gulp.dest('docs/build/styles'));
    },

    function () {
      var bundle = galv.bundle('docs/src/scripts/index.js');
      return gulp
        .src(bundle.files)
        .pipe(bundle.stream())
        .pipe(gulp.dest('docs/build/scripts'));
    }
  );
};
