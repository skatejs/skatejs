'use strict';

var galvatron = require('galvatron');

module.exports = galvatron
  .pre('babel')
  .post('globalize');
