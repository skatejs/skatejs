(function (global, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['exports', 'module', '../constants', '../api/emit', '../api/event', '../util/dash-case', '../util/data'], factory);
  } else if (typeof exports !== 'undefined' && typeof module !== 'undefined') {
    factory(exports, module, require('../constants'), require('../api/emit'), require('../api/event'), require('../util/dash-case'), require('../util/data'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, mod, global.constants, global.apiEmit, global.apiEvent, global.dashCase, global.data);
    global.unknown = mod.exports;
  }
})(this, function (exports, module, _constants, _apiEmit, _apiEvent, _utilDashCase, _utilData) {
  'use strict';

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  var _apiEmit2 = _interopRequireDefault(_apiEmit);

  var _apiEvent2 = _interopRequireDefault(_apiEvent);

  var _dashCase = _interopRequireDefault(_utilDashCase);

  var _data = _interopRequireDefault(_utilData);

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
    var _notify = prop.notify === undefined ? true : prop.notify;
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
        var oldValue = _value;
        var newValue = _coerce(value);

        // We do nothing if the value hasn't changed.
        if (oldValue === newValue) {
          return;
        }

        // Regardless of any options, we store the value internally.
        _value = newValue;

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

        // A setter is responsible for setting its own value.
        if (_setter) {
          _setter.call(this, newValue, oldValue);
        }

        // Only notify if the value has changed.
        if (_notify) {
          (0, _apiEmit2['default'])(this, 'skate-property-' + name);
        }
      }
    };
  }

  function defineProperty(elem, name, prop) {
    var attributeToPropertyMap = (0, _data['default'])(elem).attributeToPropertyMap = {};

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

    (prop.deps || []).forEach(function (dep) {
      (0, _apiEvent2['default'])(elem, _constants.EVENT_PREFIX + dep, function (e) {
        if (e.target === e.delegateTarget || this === e.delegateTarget) {
          (0, _apiEmit2['default'])(elem, 'skate-property-' + name);
        }
      });
    });
  }

  function defineProperties(elem, props) {
    Object.keys(props).forEach(function (name) {
      defineProperty(elem, name, props[name]);
    });
  }

  module.exports = function (elem, props, prop) {
    if (typeof props === 'string') {
      defineProperty(elem, props, prop);
    } else {
      defineProperties(elem, props || {});
    }
  };
});