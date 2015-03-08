'use strict';

var galvatron = require('galvatron');
var gulpUtil = require('gulp-util');
var path = require('path');

function log (str, data) {
  gulpUtil.log(gulpUtil.template(str, data));
}

function relative (file) {
  return path.relative(process.cwd(), file);
}

galvatron.events
  .on('trace.new', function (file, depth) {
    log('<%= trace %> <%= indent %><%= file %>', {
      trace: depth === 0 ? 'TRACE' : '',
      indent: depth > 0 ? '   | ' + (new Array(depth).join('  ')) + '- ' : '',
      file: relative(file)
    });
  })
  .on('bundle', function (file) {
    log('GENERATE <%= file %>', {
      file: relative(file)
    });
  })
  .on('update', function (file, main) {
    log('UPDATE <%= file %> -> <%= main %>', {
      file: relative(file),
      main: relative(main)
    });
  })
  .on('update.main', function (file) {
    log('BUNDLE <%= file %>', {
      file: relative(file)
    })
  })
  .on('watch', function (file) {
    log('WATCH <%= file %>', {
      file: relative(file)
    });
  });

galvatron.transformer
  .pre('babel')
  .post('globalize');

module.exports = galvatron;
