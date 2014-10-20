module.exports = function (grunt) {
  var version = require('../lib/version')(grunt);

  function file (path) {
    return {
      dest: path,
      src: path
    };
  }

  return {
    version: {
      options: {
        patterns: [
          {
            match: new RegExp(version()),
            replacement: version.next()
          }
        ]
      },
      files: [
        file('src/version.js'),
        file('bower.json'),
        file('package.json')
      ]
    }
  };
};
