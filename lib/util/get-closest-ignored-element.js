(function (global, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['exports', 'module', './ignored'], factory);
  } else if (typeof exports !== 'undefined' && typeof module !== 'undefined') {
    factory(exports, module, require('./ignored'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, mod, global.ignored);
    global.getClosestIgnoredElement = mod.exports;
  }
})(this, function (exports, module, _ignored) {
  'use strict';

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  var _ignored2 = _interopRequireDefault(_ignored);

  var Element = window.Element;

  module.exports = function (element) {
    var parent = element;
    while (parent instanceof Element) {
      if ((0, _ignored2['default'])(parent)) {
        return parent;
      }
      parent = parent.parentNode;
    }
  };
});