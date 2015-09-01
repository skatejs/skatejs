(function (global, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['exports', 'module', '../util/assign-safe', '../util/dash-case', '../util/data'], factory);
  } else if (typeof exports !== 'undefined' && typeof module !== 'undefined') {
    factory(exports, module, require('../util/assign-safe'), require('../util/dash-case'), require('../util/data'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, mod, global.assignSafe, global.dashCase, global.data);
    global.unknown = mod.exports;
  }
})(this, function (exports, module, _utilAssignSafe, _utilDashCase, _utilData) {
  'use strict';

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  var _assignSafe = _interopRequireDefault(_utilAssignSafe);

  var _dashCase = _interopRequireDefault(_utilDashCase);

  var _data = _interopRequireDefault(_utilData);

  function normaliseProp(prop) {
    if (typeof prop === 'object') {
      prop = (0, _assignSafe['default'])({}, prop);
    } else {
      prop = { type: prop };
    }
    return prop;
  }

  function normaliseAttr(prop, name) {
    var attr = prop.attr;
    return attr === true ? (0, _dashCase['default'])(name) : attr;
  }

  function normaliseInit(prop, elem) {
    var init = prop.init;
    if (init !== undefined) {
      (function () {
        var value = init;
        init = typeof init === 'function' ? init : function () {
          return value;
        };
        init = init.bind(elem);
      })();
    }
    return init;
  }

  function normaliseType(prop) {
    var type = prop.type;
    return typeof type !== 'function' ? function (val) {
      return val;
    } : type;
  }

  function property(elem, name, prop) {
    var internalGetter, internalSetter, internalValue, isBoolean;

    prop = normaliseProp(prop);
    prop.attr = normaliseAttr(prop, name);
    prop.init = normaliseInit(prop, elem);
    prop.type = normaliseType(prop);
    internalGetter = prop.get;
    internalSetter = prop.set;
    isBoolean = prop.type && prop.type === Boolean;

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
      var oldValue = this[name];

      // Don't do anything if the values are the same.
      if (newValue === oldValue) {
        return;
      }

      // We only store the value internally if a getter isn't specified.
      if (!internalGetter) {
        internalValue = newValue;
      }

      // We check first to see if we're already updating the property from
      // the attribute. If we are, then there's no need to update the attribute
      // especially because it would invoke an infinite loop.
      if (prop.attr && !info.updatingProperty) {
        info.updatingAttribute = true;

        if (isBoolean && internalValue) {
          this.setAttribute(prop.attr, '');
        } else if (internalValue == null || isBoolean && !internalValue) {
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
    };

    return prop;
  }

  function defineProperty(elem, name, prop) {
    // We don't need to scope the data to the component ID be cause if multiple
    // bindings on the same component define the same attribute, then they'd
    // conflict anyways.
    var info = (0, _data['default'])(elem);
    var existingValue = elem[name];

    if (!info.attributeToPropertyMap) {
      info.attributeToPropertyMap = {};
    }

    prop = property(elem, name, prop);
    Object.defineProperty(elem, name, prop);

    // This ensures that the corresponding attribute will know to update this
    // property when it is set.
    if (prop.attr) {
      info.attributeToPropertyMap[prop.attr] = name;
    }

    return function () {
      if (prop.attr && elem.hasAttribute(prop.attr)) {
        elem.attributeChangedCallback(prop.attr, null, elem.getAttribute(prop.attr));
      } else if (existingValue !== undefined) {
        elem[name] = existingValue;
      } else if (prop.init) {
        elem[name] = prop.init.call(this);
      }
    };
  }

  module.exports = function (elem, props) {
    var funcs = Object.keys(props).map(function (name) {
      return defineProperty(elem, name, props[name]);
    });
    return function () {
      var _this = this;

      funcs.forEach(function (func) {
        return func.call(_this);
      });
    };
  };
});