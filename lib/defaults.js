(function (global, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['exports', 'module', './type/element'], factory);
  } else if (typeof exports !== 'undefined' && typeof module !== 'undefined') {
    factory(exports, module, require('./type/element'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, mod, global.type);
    global.defaults = mod.exports;
  }
})(this, function (exports, module, _typeElement) {
  'use strict';

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  var _type = _interopRequireDefault(_typeElement);

  var noop = function noop() {};

  module.exports = {
    attached: noop,
    attribute: noop,
    created: noop,
    render: noop,
    detached: noop,
    events: {},
    'extends': '',
    properties: {},
    prototype: {},
    resolvedAttribute: 'resolved',
    ready: noop,
    type: _type['default'],
    unresolvedAttribute: 'unresolved'
  };
});