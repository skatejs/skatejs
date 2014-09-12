module.exports = function (grunt) {
  return {
    dist: {
      files: ['src/*.js'],
      tasks: ['shell:dist', 'uglify:dist']
    },
    test: {
      files: ['src/*.js', 'test/{*,**.js}'],
      tasks: ['shell:test']
    }
  };
};
