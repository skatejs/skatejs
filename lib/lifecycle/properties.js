(function (global, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['exports', 'module', '../constants', '../util/dash-case', '../util/data', './events'], factory);
  } else if (typeof exports !== 'undefined' && typeof module !== 'undefined') {
    factory(exports, module, require('../constants'), require('../util/dash-case'), require('../util/data'), require('./events'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, mod, global.constants, global.dashCase, global.data, global.events);
    global.unknown = mod.exports;
  }
})(this, function (exports, module, _constants, _utilDashCase, _utilData, _events) {
  'use strict';

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  var _dashCase = _interopRequireDefault(_utilDashCase);

  var _data = _interopRequireDefault(_utilData);

  var _events2 = _interopRequireDefault(_events);

  function returnSingle(elem, name) {
    return function () {
      return elem[name];
    };
  }

  function returnMultiple(elem, name, selector) {
    return function () {
      return [].slice.call(elem.querySelectorAll(selector)).map(function (desc) {
        return desc[name];
      });
    };
  }

  function resolveReturnFunction(elem) {
    return function (name) {
      var parts = name.split(' ');
      return parts[1] ? returnMultiple(elem, parts[0], parts[1]) : returnSingle(elem, name);
    };
  }

  function notify(elem, name) {
    var e = document.createEvent('CustomEvent');
    e.initCustomEvent('' + _constants.EVENT_PREFIX + '' + name, true, false, undefined);
    elem.dispatchEvent(e);
  }

  function property(name, prop) {
    if (typeof prop !== 'object') {
      prop = { type: prop };
    }

    var _attribute = prop.attr;
    var _coerce = prop.type || function (val) {
      return val;
    };
    var _dependencies = prop.deps || [];
    var _getter = prop.get;
    var _isBoolean = prop.type && prop.type === Boolean;
    var _notify = prop.notify;
    var _setter = prop.set;
    var _value;

    if (_attribute === true) {
      _attribute = (0, _dashCase['default'])(name);
    }

    return {
      get: function get() {
        return _getter ? _getter.apply(this, _dependencies.map(resolveReturnFunction(this))) : _value;
      },

      set: function set(value) {
        var info = (0, _data['default'])(this);
        _value = _coerce(value);

        // We check first to see if we're already updating the property from
        // the attribute. If we are, then there's no need to update the attribute
        // especially because it would invoke an infinite loop.
        if (_attribute && !info.updatingProperty) {
          info.updatingAttribute = true;

          if (_isBoolean && _value) {
            this.setAttribute(_attribute, '');
          } else if (_isBoolean && !_value) {
            this.removeAttribute(_attribute, '');
          } else {
            this.setAttribute(_attribute, _value);
          }

          info.updatingAttribute = false;
        }

        if (_setter) {
          _setter.call(this, _value);
        }

        if (_notify) {
          notify(this, name);
        }
      }
    };
  }

  module.exports = function (elem) {
    var props = arguments[1] === undefined ? {} : arguments[1];

    var attributeToPropertyMap = (0, _data['default'])(elem).attributeToPropertyMap = {};

    Object.keys(props).forEach(function (name) {
      var prop = props[name];

      if (!prop) {
        return;
      }

      Object.defineProperty(elem, name, property(name, prop));

      if (prop.attr) {
        attributeToPropertyMap[(0, _dashCase['default'])(name)] = name;
      }

      if (typeof prop.value === 'function') {
        elem[name] = prop.value();
      } else if (typeof prop.value !== 'undefined') {
        elem[name] = prop.value;
      }

      (0, _events2['default'])(elem, (prop.deps || []).reduce(function (prev, curr) {
        prev[_constants.EVENT_PREFIX + curr] = notify.bind(null, elem, name);
        return prev;
      }, {}));
    });
  };
});