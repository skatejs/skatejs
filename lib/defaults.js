(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['module', 'exports', './type/element'], factory);
  } else if (typeof exports !== "undefined") {
    factory(module, exports, require('./type/element'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod, mod.exports, global.element);
    global.defaults = mod.exports;
  }
})(this, function (module, exports, _element) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _element2 = _interopRequireDefault(_element);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  var nope = null;
  exports.default = {
    attached: nope,
    attribute: nope,
    created: nope,
    render: nope,
    detached: nope,
    events: nope,
    extends: nope,
    properties: nope,
    prototype: {},
    resolvedAttribute: 'resolved',
    ready: nope,
    type: _element2.default,
    unresolvedAttribute: 'unresolved'
  };
  module.exports = exports['default'];
});