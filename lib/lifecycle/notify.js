(function (global, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['exports', 'module', '../constants'], factory);
  } else if (typeof exports !== 'undefined' && typeof module !== 'undefined') {
    factory(exports, module, require('../constants'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, mod, global.constants);
    global.unknown = mod.exports;
  }
})(this, function (exports, module, _constants) {
  'use strict';

  module.exports = function (elem, name) {
    var e = document.createEvent('CustomEvent');
    e.initCustomEvent('' + _constants.EVENT_PREFIX + '' + name, false, false, undefined);
    elem.dispatchEvent(e);
  };
});