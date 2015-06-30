var gulpAutoTask = require('gulp-auto-task');

gulpAutoTask('{*,**/*}.js', {
  base: './node_modules/chippy/src/task'
});
