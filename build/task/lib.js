'use strict';

var galvatron = require('galvatron')();
var gulp = require('gulp');

galvatron.transformer.post('babel', {
  modules: 'umd'
});

module.exports = function () {
  var bundle = galvatron.bundle('src/skate.js');
  return gulp
    .src(bundle.all)
    .pipe(bundle.streamOne())
    .pipe(gulp.dest('lib'));
};
