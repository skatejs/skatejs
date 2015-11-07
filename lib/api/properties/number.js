(function (global, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['exports', 'module', 'object-assign'], factory);
  } else if (typeof exports !== 'undefined' && typeof module !== 'undefined') {
    factory(exports, module, require('object-assign'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, mod, global.assign);
    global.number = mod.exports;
  }
})(this, function (exports, module, _objectAssign) {
  'use strict';

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  var _assign = _interopRequireDefault(_objectAssign);

  module.exports = _assign['default'].bind(null, {}, {
    coerce: function coerce(value) {
      return typeof value === 'undefined' ? value : Number(value);
    },
    deserialize: function deserialize(value) {
      return value === null ? undefined : value;
    },
    serialize: function serialize(value) {
      return typeof value === 'undefined' ? value : Number(value);
    }
  });
});