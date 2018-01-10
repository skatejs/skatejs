'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _litExtended = require('lit-html/lib/lit-extended');

exports.default = (Base = HTMLElement) =>
  class extends Base {
    renderer(root, call) {
      (0, _litExtended.render)(call(), root);
    }
  };
