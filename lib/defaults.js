(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['module', 'exports'], factory);
  } else if (typeof exports !== "undefined") {
    factory(module, exports);
  } else {
    var mod = {
      exports: {}
    };
    factory(mod, mod.exports);
    global.defaults = mod.exports;
  }
})(this, function (module, exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var nope = null;
  exports.default = {
    attached: nope,
    attribute: nope,
    created: nope,
    definedAttribute: 'defined',
    render: nope,
    detached: nope,
    events: nope,
    extends: nope,
    properties: nope,
    prototype: {},
    ready: nope,
    renderedAttribute: 'rendered'
  };
  module.exports = exports['default'];
});