'use strict';

var sh = require('shelljs');

module.exports = function () {
  if (sh.exec('./node_modules/.bin/jshint build src test').code !== 0) {
    throw new Error(sh.error());
  }
  // Enable once ES6 support lands.
  // sh.exec('./node_modules/.bin/jscs build src test');
};
