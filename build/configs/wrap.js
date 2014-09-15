module.exports = function () {
  return {
    dist: {
      src: 'dist/skate.js',
      dest: 'dist/skate.js',
      options: {
        wrapper: [
          '(function () {\n\'use strict\';',
          '}());'
        ]
      }
    }
  };
};
