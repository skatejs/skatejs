'use strict';

var cmd = require('./commander');
var mac = require('mac');

module.exports = mac.mac({
  // Tasks that watch never emit an "end" event so we must do the next closest
  // thing and watch for any data chunks. This is generally OK because watch
  // tasks are paired with development and live-reload servers that should
  // eventually refresh when all data is finished anyways.
  on: cmd.watch ? 'data end' : 'end'
});
