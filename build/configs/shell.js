module.exports = function (grunt) {
  var cmd = require('../lib/cmd');
  var grunt = require('../lib/grunt');
  var traceur = require('../lib/traceur');
  var version = require('../lib/version')(grunt);

  return {
    dist: {
      command: cmd(
        'rm -rf dist',
        traceur('src/skate.js', 'dist/skate.js')
      )
    },
    docs: {
      command: traceur('docs/src/scripts/index.js', 'docs/build/scripts/index.js')
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
    release: {
      command: cmd(
        grunt('replace:version'),
        grunt('test')
        //'git tag -a ' + version.next() + ' -m ' + version.next(),
        //'git push --tags'
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
