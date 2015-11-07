(function (global, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['exports'], factory);
  } else if (typeof exports !== 'undefined') {
    factory(exports);
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports);
    global.index = mod.exports;
  }
})(this, function (exports) {
  'use strict';

  Object.defineProperty(exports, '__esModule', {
    value: true
  });

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { 'default': obj };
  }

  var _html = require('./html');

  var _html2 = _interopRequireDefault(_html);

  var _globalRegistry = require('../../global/registry');

  var _globalRegistry2 = _interopRequireDefault(_globalRegistry);

  function render(elem) {
    _globalRegistry2['default'].find(elem).forEach(function (component) {
      return component.render && component.render(elem);
    });
  }

  render.html = _html2['default'];

  exports['default'] = render;
  module.exports = exports['default'];
});