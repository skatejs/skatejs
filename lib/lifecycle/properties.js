(function (global, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['exports', 'module', '../util/assign-safe', '../util/dash-case', '../util/data', '../api/emit'], factory);
  } else if (typeof exports !== 'undefined' && typeof module !== 'undefined') {
    factory(exports, module, require('../util/assign-safe'), require('../util/dash-case'), require('../util/data'), require('../api/emit'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, mod, global.assignSafe, global.dashCase, global.data, global.emit);
    global.properties = mod.exports;
  }
})(this, function (exports, module, _utilAssignSafe, _utilDashCase, _utilData, _apiEmit) {
  'use strict';

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  var _assignSafe = _interopRequireDefault(_utilAssignSafe);

  var _dashCase = _interopRequireDefault(_utilDashCase);

  var _data = _interopRequireDefault(_utilData);

  var _emit = _interopRequireDefault(_apiEmit);

  function isEmpty(value) {
    return value == null;
  }

  function property(name, prop) {
    var internalValue = undefined;
    var isBoolean = prop.type === Boolean;

    if (typeof prop.init === 'function') {
      internalValue = prop.init();
    } else if (prop.init !== undefined) {
      internalValue = prop.init;
    }

    prop.get = function () {
      return internalValue;
    };

    prop.set = function (value) {
      var info = (0, _data['default'])(this);

      if (isEmpty(value) && prop.attr && !info.updatingProperty) {
        this.removeAttribute(prop.attr);
        return;
      }

      // If the property is being updated and it is a boolean we must just check
      // if the attribute exists because "" is true for a boolean attribute.
      if (info.updatingProperty && isBoolean) {
        value = this.hasAttribute(prop.attr);
      }

      // We report both new and old values;
      var newValue = prop.type ? prop.type(value) : value;
      var oldValue = internalValue;
      internalValue = newValue;

      // Don't do anything if the values are the same.
      if (newValue === oldValue) {
        return;
      }

      // We check first to see if we're already updating the property from
      // the attribute. If we are, then there's no need to update the attribute
      // especially because it would invoke an infinite loop.
      if (prop.attr && !info.updatingProperty) {
        info.updatingAttribute = true;

        if (isBoolean && internalValue) {
          this.setAttribute(prop.attr, '');
        } else if (isEmpty(internalValue) || isBoolean && !internalValue) {
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
      if (prop.update) {
        prop.update.call(this, newValue, oldValue);
      }

      // If we are emitting notify the element of the change.
      if (prop.emit) {
        (0, _emit['default'])(this, prop.emit, {
          bubbles: false,
          cancelable: false,
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

  function defineProperty(elem, name) {
    var properties = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

    var initialValue = undefined;
    var info = (0, _data['default'])(elem);

    if (!info.attributeToPropertyMap) {
      info.attributeToPropertyMap = {};
    }

    var prop = typeof properties === 'function' ? { type: properties } : (0, _assignSafe['default'])({}, properties);

    if (prop.attr) {
      if (prop.attr === true) {
        prop.attr = (0, _dashCase['default'])(name);
      }
      info.attributeToPropertyMap[prop.attr] = name;
    }

    if (prop.attr && elem.hasAttribute(prop.attr)) {
      initialValue = elem.getAttribute(prop.attr);
    } else {
      initialValue = elem[name];
    }

    if (prop.emit === true) {
      prop.emit = 'skate.property';
    }

    if (initialValue !== undefined) {
      prop.init = initialValue;
    }

    if (prop.type) {
      prop.init = prop.type === Boolean && prop.init === '' || prop.type(prop.init);
    }

    prop = property(name, prop);
    Object.defineProperty(elem, name, prop);
  }

  module.exports = function (props) {
    var _this = this;

    Object.keys(props).forEach(function (name) {
      return defineProperty(_this, name, props[name]);
    });
  };
});