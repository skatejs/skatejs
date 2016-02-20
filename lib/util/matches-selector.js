(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['module', 'exports', '../native/create-element'], factory);
  } else if (typeof exports !== "undefined") {
    factory(module, exports, require('../native/create-element'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod, mod.exports, global.createElement);
    global.matchesSelector = mod.exports;
  }
})(this, function (module, exports, _createElement) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  exports.default = function (element, selector) {
    if (hasNativeMatchesSelectorDetattachedBug) {
      var clone = element.cloneNode();
      (0, _createElement2.default)('div').appendChild(clone);
      return nativeMatchesSelector.call(clone, selector);
    }
    return nativeMatchesSelector.call(element, selector);
  };

  var _createElement2 = _interopRequireDefault(_createElement);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  var elProto = window.HTMLElement.prototype;
  var nativeMatchesSelector = elProto.matches || elProto.msMatchesSelector || elProto.webkitMatchesSelector || elProto.mozMatchesSelector || elProto.oMatchesSelector;

  // Only IE9 has this msMatchesSelector bug, but best to detect it.
  var hasNativeMatchesSelectorDetattachedBug = !nativeMatchesSelector.call((0, _createElement2.default)('div'), 'div');

  module.exports = exports['default'];
});