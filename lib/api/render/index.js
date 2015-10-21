(function (global, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['exports', 'module', './html', '../../global/registry'], factory);
  } else if (typeof exports !== 'undefined' && typeof module !== 'undefined') {
    factory(exports, module, require('./html'), require('../../global/registry'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, mod, global.html, global.registry);
    global.index = mod.exports;
  }
})(this, function (exports, module, _html, _globalRegistry) {
  'use strict';

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  var _html2 = _interopRequireDefault(_html);

  var _registry = _interopRequireDefault(_globalRegistry);

  function render(elem) {
    _registry['default'].find(elem).forEach(function (component) {
      return component.render && component.render(elem);
    });
  }

  render.html = _html2['default'];

  module.exports = render;
});