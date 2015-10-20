(function (global, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['exports', 'module', '../fragment'], factory);
  } else if (typeof exports !== 'undefined' && typeof module !== 'undefined') {
    factory(exports, module, require('../fragment'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, mod, global.fragment);
    global.html = mod.exports;
  }
})(this, function (exports, module, _fragment) {
  'use strict';

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  var _fragment2 = _interopRequireDefault(_fragment);

  module.exports = function (render) {
    return function (elem) {
      while (elem.childNodes.length) {
        elem.removeChild(elem.childNodes[0]);
      }
      elem.appendChild((0, _fragment2['default'])(render(elem)));
    };
  };
});