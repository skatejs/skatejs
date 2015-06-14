(function (global, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['exports', 'module', '../api/emit', '../api/event', '../util/dash-case', '../util/data'], factory);
  } else if (typeof exports !== 'undefined' && typeof module !== 'undefined') {
    factory(exports, module, require('../api/emit'), require('../api/event'), require('../util/dash-case'), require('../util/data'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, mod, global.apiEmit, global.apiEvent, global.dashCase, global.data);
    global.unknown = mod.exports;
  }
})(this, function (exports, module, _apiEmit, _apiEvent, _utilDashCase, _utilData) {
  'use strict';

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  var _apiEmit2 = _interopRequireDefault(_apiEmit);

  var _apiEvent2 = _interopRequireDefault(_apiEvent);

  var _dashCase = _interopRequireDefault(_utilDashCase);

  var _data = _interopRequireDefault(_utilData);

  function property(name, prop) {
    var internalGetter, internalSetter, internalValue, isBoolean;

    if (typeof prop !== 'object') {
      prop = { type: prop };
    }

    if (prop.attr === true) {
      prop.attr = (0, _dashCase['default'])(name);
    }

    if (typeof prop.deps === 'string') {
      prop.deps = prop.deps.split(' ');
    }

    if (!Array.isArray(prop.deps)) {
      prop.deps = [];
    }

    if (typeof prop.type !== 'function') {
      prop.type = function (val) {
        return val;
      };
    }

    internalGetter = prop.get;
    internalSetter = prop.set;
    internalValue = typeof prop.value === 'function' ? prop.value.call(this) : prop.value;
    isBoolean = prop.type && prop.type === Boolean;
    delete prop.value;

    prop.get = function () {
      return internalGetter ? internalGetter.apply(this) : internalValue;
    };

    prop.set = function (value) {
      var info = (0, _data['default'])(this);

      // If the property is being updated and it is a boolean we must just check
      // if the attribute exists because "" is true for a boolean attribute.
      if (info.updatingProperty && isBoolean) {
        value = this.hasAttribute(prop.attr);
      }

      // We report both new and old values;
      var newValue = prop.type(value);
      var oldValue = internalValue;

      // We do nothing if the value hasn't changed.
      if (oldValue === newValue) {
        return;
      }

      // Regardless of any options, we store the value internally.
      internalValue = newValue;

      // We check first to see if we're already updating the property from
      // the attribute. If we are, then there's no need to update the attribute
      // especially because it would invoke an infinite loop.
      if (prop.attr && !info.updatingProperty) {
        info.updatingAttribute = true;

        if (isBoolean && internalValue) {
          this.setAttribute(prop.attr, '');
        } else if (isBoolean && !internalValue) {
          this.removeAttribute(prop.attr, '');
        } else {
          this.setAttribute(prop.attr, internalValue);
        }

        info.updatingAttribute = false;
      }

      // A setter is responsible for setting its own value. We still store the
      // value internally because the default getter may still be used to return
      // that value. Even if it's not, we use it to reference the old value which
      // is useful information for the setter.
      if (internalSetter) {
        internalSetter.call(this, newValue, oldValue);
      }

      if (prop.notify) {
        (0, _apiEmit2['default'])(this, prop.notify, {
          detail: {
            name: name,
            newValue: newValue,
            oldValue: oldValue
          }
        });
      }
    };

    return prop;
  }

  function defineProperty(elem, name, prop) {
    var attributeToPropertyMap = (0, _data['default'])(elem).attributeToPropertyMap = {};
    prop = property(name, prop);
    Object.defineProperty(elem, name, prop);

    if (prop.attr) {
      attributeToPropertyMap[(0, _dashCase['default'])(name)] = name;
    }

    if (typeof prop.value === 'function') {
      elem[name] = prop.value();
    } else if (typeof prop.value !== 'undefined') {
      elem[name] = prop.value;
    }

    // If you aren't notifying of property changes, then dependencies aren't
    // listened to.
    if (prop.notify) {
      prop.deps.forEach(function (dep) {
        (0, _apiEvent2['default'])(elem, dep, _apiEmit2['default'].bind(null, elem, prop.notify));
      });
    }
  }

  function defineProperties(elem, props) {
    Object.keys(props).forEach(function (name) {
      defineProperty(elem, name, props[name]);
    });
  }

  module.exports = function (elem) {
    var props = arguments[1] === undefined ? {} : arguments[1];
    var prop = arguments[2] === undefined ? {} : arguments[2];

    if (typeof props === 'string') {
      defineProperty(elem, props, prop);
    } else {
      defineProperties(elem, props);
    }

    return this;
  };
});