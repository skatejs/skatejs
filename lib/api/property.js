(function (global, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['exports', 'module', '../util/assign-safe', '../util/dash-case', '../util/data', './event', '../util/maybe-this', './notify'], factory);
  } else if (typeof exports !== 'undefined' && typeof module !== 'undefined') {
    factory(exports, module, require('../util/assign-safe'), require('../util/dash-case'), require('../util/data'), require('./event'), require('../util/maybe-this'), require('./notify'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, mod, global.assignSafe, global.dashCase, global.data, global.event, global.maybeThis, global.notify);
    global.unknown = mod.exports;
  }
})(this, function (exports, module, _utilAssignSafe, _utilDashCase, _utilData, _event, _utilMaybeThis, _notify) {
  'use strict';

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  var _assignSafe = _interopRequireDefault(_utilAssignSafe);

  var _dashCase = _interopRequireDefault(_utilDashCase);

  var _data = _interopRequireDefault(_utilData);

  var _event2 = _interopRequireDefault(_event);

  var _maybeThis = _interopRequireDefault(_utilMaybeThis);

  var _notify2 = _interopRequireDefault(_notify);

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

    if (typeof prop.deps === 'string') {
      prop.deps = [prop.deps];
    }

    if (Array.isArray(prop.deps)) {
      prop.deps = prop.deps.map(function (name) {
        return 'skate.property.' + name;
      });
    }

    if (prop.notify === undefined) {
      prop.notify = true;
    }

    if (typeof prop.type !== 'function') {
      prop.type = function (val) {
        return val;
      };
    }

    prop._value = prop.value;
    delete prop.value;
    if (prop._value !== undefined && typeof prop._value !== 'function') {
      (function () {
        var value = prop._value;
        prop._value = function () {
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

      // TODO: Should we check at this point to see if it has changed and do
      // nothing if it hasn't? How can we then force-update if we need to?

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
        (0, _notify2['default'])(this, name, {
          newValue: newValue,
          oldValue: oldValue
        });
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
    if (prop._value && (!prop.attr || !elem.hasAttribute(prop.attr))) {
      elem[name] = prop._value.call(elem);
    }

    // This ensures that the corresponding attribute will know to update this
    // property when it is set.
    if (prop.attr) {
      info.attributeToPropertyMap[prop.attr] = name;
    }

    // If you aren't notifying of property changes, then dependencies aren't
    // listened to.
    if (prop.notify) {
      // TODO: Should we be invoking the setter or just notifying that this
      // property changed?
      (0, _event2['default'])(elem, prop.deps, function () {
        return elem[name] = elem[name];
      });
    }
  }

  function defineProperties(elem, props) {
    Object.keys(props).forEach(function (name) {
      defineProperty(elem, name, props[name]);
    });
  }

  module.exports = (0, _maybeThis['default'])(function (elem) {
    var props = arguments[1] === undefined ? {} : arguments[1];
    var prop = arguments[2] === undefined ? {} : arguments[2];

    if (typeof props === 'string') {
      defineProperty(elem, props, prop);
    } else {
      defineProperties(elem, props);
    }
  });
});