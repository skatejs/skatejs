module.exports = function (grunt) {
  var cmd = require('../lib/cmd');
  var traceur = require('../lib/traceur');

  return {
    dist: {
      command: cmd(
        'rm -rf dist',
        traceur('src/skate.js', 'dist/skate.js')
      )
    },
    docs: {
      command: cmd(
        traceur('docs/src/scripts/index.js', 'docs/build/scripts/index.js')
      )
    },
    installBower: {
      command: './node_modules/.bin/bower install'
    },
    installTraceur: {
      command: cmd(
        'cd ./node_modules/traceur',
        'npm install'
      )
    },
    test: {
      command: cmd(
        'rm -rf .tmp',
        traceur('test/unit.js', '.tmp/run-unit-tests.js')
      )
    }
  };
};
