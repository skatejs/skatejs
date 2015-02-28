'use strict';

var gulpAutoTask = require('gulp-auto-task');

gulpAutoTask('{*,**/*}.js', {
  base: './build/task'
});
