(function (global, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['exports', 'module', '../util/chain', '../util/data', '../util/protos'], factory);
  } else if (typeof exports !== 'undefined' && typeof module !== 'undefined') {
    factory(exports, module, require('../util/chain'), require('../util/data'), require('../util/protos'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, mod, global.chain, global.data, global.protos);
    global.unknown = mod.exports;
  }
})(this, function (exports, module, _utilChain, _utilData, _utilProtos) {
  'use strict';

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  var _chain = _interopRequireDefault(_utilChain);

  var _data = _interopRequireDefault(_utilData);

  var _protos = _interopRequireDefault(_utilProtos);

  var lifecycleNames = ['created', 'updated', 'removed'];

  function validLifecycles(obj) {
    return (0, _protos['default'])(obj || {}).reduce(function (prev, curr) {
      return prev.concat(Object.getOwnPropertyNames(curr));
    }, []).filter(function (key, idx, arr) {
      return arr.lastIndexOf(key) === idx;
    }).filter(function (key) {
      return lifecycleNames.some(function (val) {
        return key.indexOf(val) !== -1;
      });
    });
  }

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

    var map = validLifecycles(types).reduce(function (obj, unsplit) {
      return unsplit.split(' ').reduce(function (obj, split) {
        (obj[split] = obj[split] || []).push(unsplit);
        return obj;
      }, obj);
    }, {});

    return function (elem, diff) {
      (map[diff.type] || []).forEach(function (cb) {
        types[cb](elem, diff);
      });
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
      (0, _chain['default'])(fns[diff.name]).call(this, elem, diff);
    };
  }

  module.exports = function (opts) {
    var callback = makeGlobalCallback(opts.attributes);
    return function (name, oldValue, newValue) {
      var info = (0, _data['default'])(this);
      var attributeToPropertyMap = info.attributeToPropertyMap;

      callback(this, {
        name: name,
        newValue: newValue === undefined ? null : newValue,
        oldValue: oldValue === undefined ? null : oldValue,
        type: resolveType(oldValue, newValue)
      });

      // Ensure properties are notified of this change. We only do this if we're
      // not already updating the attribute from the property. This is so that
      // we don't invoke an infinite loop.
      if (attributeToPropertyMap[name] && !info.updatingAttribute) {
        info.updatingProperty = true;
        this[attributeToPropertyMap[name]] = newValue;
        info.updatingProperty = false;
      }
    };
  };
});