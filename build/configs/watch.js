module.exports = function (grunt) {
  var src = 'src/{*,**/*}.{js,less}';

  return {
    dist: {
      files: [src],
      tasks: ['shell:dist', 'uglify:dist']
    },
    docs: {
      files: ['docs/src/{*,**/*}', 'docs/templates/{*,**/*}'],
      tasks: ['docs']
    },
    test: {
      files: [src, 'test/{*,**/*}.{js,less}'],
      tasks: ['shell:test']
    }
  };
};
