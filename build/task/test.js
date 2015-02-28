'use strict';

var commander = require('../lib/commander');
var galvatron = require('../lib/galvatron');
var gulp = require('gulp');
var karma = require('karma').server;

commander
  .option('-b, --browsers [Chrome,Firefox]', 'The browsers to run the tests in.')
  .option('-g, --grep [pattern]', 'The grep pattern matching the tests you want to run.')
  .option('-h, --host [localhost]', 'The host to listen on.')
  .option('-p, --port [9876]', 'The port to listen on.')
  .parse(process.argv);

var clientArgs = [];

if (commander.grep) {
    clientArgs.push('--grep');
    clientArgs.push(commander.grep);
}

function run () {
    karma.start({
        autoWatch: !!commander.watch,
        singleRun: !commander.watch,
        hostname: commander.host || 'localhost',
        port: commander.port || 9876,
        frameworks: ['mocha', 'sinon-chai'],
        browsers: (commander.browsers || 'Chrome').split(','),
        client: {
            args: clientArgs
        },
        files: [
            '.tmp/unit.js'
        ]
    });
}

module.exports = function () {
    gulp.src('test/unit.js')
        .pipe(galvatron.stream())
        .pipe(gulp.dest('.tmp'))
        .on('finish', run);
};
