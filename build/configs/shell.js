module.exports = function (grunt) {
  var cmd = require('../lib/cmd');
  var git = require('../lib/git');
  var task = require('../lib/grunt');
  var traceur = require('../lib/traceur');
  var version = require('../lib/version')(grunt);

  return {
    deploy: {
      command: cmd(
        'rm -rf .tmp',
        'mkdir -p .tmp',
        'cd .tmp',
        'git clone git@github.com:skatejs/skatejs .',
        'git checkout gh-pages',
        'find . -path ./.git -prune -o -exec rm -rf {} \; 2> /dev/null',
        'cp -rf ../docs/build/* ./',
        'git add .',
        'git commit -am "Update documentation."',
        'git push',
        'cd ..',
        'rm -rf .tmp'
      )
    },
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
        task('replace:version --tag ' + version.next()),
        task('test'),
        task('dist'),
        git('commit -am "' + version() + ' -> ' + version.next() + '"'),
        git('tag -a ' + version.next() + ' -m ' + version.next()),
        git('push'),
        git('push --tags')
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
