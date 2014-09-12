module.exports = function (grunt) {
  return {
    test: {
      files: ['src/*.js', 'test/{*,**.js}'],
      tasks: ['shell:test']
    }
  };
};
