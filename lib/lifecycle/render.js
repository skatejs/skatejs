(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['module', 'exports', '../api/vdom'], factory);
  } else if (typeof exports !== "undefined") {
    factory(module, exports, require('../api/vdom'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod, mod.exports, global.vdom);
    global.render = mod.exports;
  }
})(this, function (module, exports, _vdom) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  exports.default = function (opts) {
    var internalRenderer = opts.render;

    if (!internalRenderer) {
      return;
    }

    return function (elem) {
      if (!elem.shadowRoot) {
        elem.attachShadow({ mode: 'open' });
      }
      patch(elem.shadowRoot, internalRenderer, elem);
    };
  };

  var patch = _vdom.IncrementalDOM.patch;
  module.exports = exports['default'];
});