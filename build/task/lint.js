'use strict';

var sh = require('shelljs');

module.exports = function () {
  sh.exec('./node_modules/.bin/jshint build src test');
  // Enable once ES6 support lands.
  // sh.exec('./node_modules/.bin/jscs build src test');
};
