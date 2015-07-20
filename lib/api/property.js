(function (global, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['exports', 'module', '../util/assign-safe', '../util/dash-case', '../util/data', '../util/maybe-this'], factory);
  } else if (typeof exports !== 'undefined' && typeof module !== 'undefined') {
    factory(exports, module, require('../util/assign-safe'), require('../util/dash-case'), require('../util/data'), require('../util/maybe-this'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, mod, global.assignSafe, global.dashCase, global.data, global.maybeThis);
    global.unknown = mod.exports;
  }
})(this, function (exports, module, _utilAssignSafe, _utilDashCase, _utilData, _utilMaybeThis) {
  'use strict';

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  var _assignSafe = _interopRequireDefault(_utilAssignSafe);

  var _dashCase = _interopRequireDefault(_utilDashCase);

  var _data = _interopRequireDefault(_utilData);

  var _maybeThis = _interopRequireDefault(_utilMaybeThis);

  // TODO: Lean out option normalisation.
  function property(name, prop) {
    var internalGetter, internalSetter, internalValue, isBoolean;

    if (typeof prop === 'object') {
      prop = (0, _assignSafe['default'])({}, prop);
    } else {
      prop = { type: prop };
    }

    if (prop.attr === true) {
      prop.attr = (0, _dashCase['default'])(name);
    }

    if (typeof prop.type !== 'function') {
      prop.type = function (val) {
        return val;
      };
    }

    if (prop.init !== undefined && typeof prop.init !== 'function') {
      (function () {
        var value = prop.init;
        prop.init = function () {
          return value;
        };
      })();
    }

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

      // Regardless of any options, we store the value internally.
      internalValue = newValue;

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

    if (!info.attributeToPropertyMap) {
      info.attributeToPropertyMap = {};
    }

    prop = property(name, prop);
    Object.defineProperty(elem, name, prop);

    // TODO: What happens if the setter does something with a descendant that
    // may not exist yet?
    //
    // Initialise the value if a initial value was provided. Attributes that exist
    // on the element should trump any default values that are provided.
    if (prop.init && (!prop.attr || !elem.hasAttribute(prop.attr))) {
      elem[name] = prop.init.call(elem);
    }

    // This ensures that the corresponding attribute will know to update this
    // property when it is set.
    if (prop.attr) {
      info.attributeToPropertyMap[prop.attr] = name;
    }
  }

  function defineProperties(elem, props) {
    Object.keys(props).forEach(function (name) {
      defineProperty(elem, name, props[name]);
    });
  }

  module.exports = (0, _maybeThis['default'])(function (elem) {
    var props = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
    var prop = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

    if (typeof props === 'string') {
      defineProperty(elem, props, prop);
    } else {
      defineProperties(elem, props);
    }
  });
});