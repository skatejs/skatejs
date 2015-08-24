var gulpAutoTask = require('gulp-auto-task');

gulpAutoTask('{*,**/*}.js', {
  base: './node_modules/chippy/src/task'
});

gulpAutoTask('{*,**/*}.js', {
  base: 'build/task'
});
