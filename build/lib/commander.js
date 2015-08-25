'use strict';

var commander = require('commander');

module.exports = commander
  .option('-d, --debug [level]', 'Level of debug logging to show. Multiple levels are separated by a comma.')
  .option('-w, --watch', 'Rebuild when changes are detected.')
  .parse(process.argv);
