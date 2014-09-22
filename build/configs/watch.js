module.exports = function (grunt) {
  var src = 'src/{*,**/*}.{js,less}';
  var test = 'test/{*,**/*}.{js,less}';

  return {
    dist: {
      files: [src],
      tasks: ['less:dist', 'shell:dist', 'uglify:dist']
    },
    test: {
      files: [src, test],
      tasks: ['shell:test']
    }
  };
};
