'use strict';

var commander = require('../lib/commander');
var galvatron = require('../lib/galvatron');
var gulp = require('gulp');
var karma = require('karma').server;

commander
  .option('-b, --browsers [Chrome,Firefox]', 'The browsers to run the tests in.')
  .option('-g, --grep [pattern]', 'The grep pattern matching the tests you want to run.')
  .parse(process.argv);

var browsers = (commander.browsers || 'Chrome').split(',');
var clientArgs = [];

if (commander.grep) {
    clientArgs.push('--grep');
    clientArgs.push(commander.grep);
}

function run () {
    karma.start({
        autoWatch: !!commander.watch,
        singleRun: !commander.watch,
        frameworks: ['mocha', 'sinon-chai'],
        browsers: browsers,
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
