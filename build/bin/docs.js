'use strict';

var compile = require('../lib/compile');
var metalsmith = require('metalsmith');
var markdown = require('metalsmith-markdown');
var sh = require('shelljs');
var templates = require('metalsmith-templates');

metalsmith('docs')
  .use(markdown())
  .use(templates('handlebars'))
  .build();

sh.rm('-rf', 'docs/build/styles');
sh.exec('./node_modules/.bin/lessc docs/src/styles/index.less docs/build/styles/index.css');
compile('docs/src/scripts/index.js', 'docs/build/scripts/index.js');
