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

  var noop = function noop() {};

  exports.default = {
    attached: noop,
    attribute: noop,
    created: noop,
    render: noop,
    detached: noop,
    events: {},
    extends: '',
    properties: {},
    prototype: {},
    resolvedAttribute: 'resolved',
    ready: noop,
    type: _element2.default,
    unresolvedAttribute: 'unresolved'
  };
  module.exports = exports['default'];
});