module.exports = function () {
  'use strict';

  return {
    all: [
      'Gruntfile.js',
      'build/{*,**}.js',
      'src/{*,**}.js',
      'test/{*,**}.js'
    ]
  };
};
