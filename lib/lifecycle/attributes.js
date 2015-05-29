(function (global, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['exports', 'module', '../util/chain'], factory);
  } else if (typeof exports !== 'undefined' && typeof module !== 'undefined') {
    factory(exports, module, require('../util/chain'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, mod, global.chain);
    global.unknown = mod.exports;
  }
})(this, function (exports, module, _utilChain) {
  'use strict';

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  var _chain = _interopRequireDefault(_utilChain);

  function resolveType(oldValue, newValue) {
    var newValueIsString = typeof newValue === 'string';
    var oldValueIsString = typeof oldValue === 'string';

    if (!oldValueIsString && newValueIsString) {
      return 'created';
    } else if (oldValueIsString && newValueIsString) {
      return 'updated';
    } else if (oldValueIsString && !newValueIsString) {
      return 'removed';
    }
  }

  function makeSpecificCallback(types) {
    if (typeof types === 'function') {
      return types;
    }

    var fns = Object.keys(types || {}).reduce(function (prev, curr) {
      return curr.split(' ').reduce(function (prev, curr) {
        prev[curr] = (0, _chain['default'])(prev[curr], types[curr]);
        return prev;
      }, prev);
    }, {});

    return function (elem, diff) {
      (0, _chain['default'])(fns[diff.type])(elem, diff);
    };
  }

  function makeGlobalCallback(attrs) {
    if (typeof attrs === 'function') {
      return attrs;
    }

    var fns = Object.keys(attrs || {}).reduce(function (prev, curr) {
      prev[curr] = makeSpecificCallback(attrs[curr]);
      return prev;
    }, {});

    return function (elem, diff) {
      (0, _chain['default'])(fns[diff.name])(elem, diff);
    };
  }

  module.exports = function (attributes) {
    var callback = makeGlobalCallback(attributes);
    return function (name, newValue, oldValue) {
      callback(this, {
        name: name,
        newValue: newValue === undefined ? null : newValue,
        oldValue: oldValue === undefined ? null : oldValue,
        type: resolveType(oldValue, newValue)
      });
    };
  };
});