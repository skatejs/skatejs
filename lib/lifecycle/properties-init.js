(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['module', 'exports', 'object-assign', '../util/dash-case', '../util/data', '../util/debounce', '../api/emit', '../util/empty', '../api/render'], factory);
  } else if (typeof exports !== "undefined") {
    factory(module, exports, require('object-assign'), require('../util/dash-case'), require('../util/data'), require('../util/debounce'), require('../api/emit'), require('../util/empty'), require('../api/render'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod, mod.exports, global.objectAssign, global.dashCase, global.data, global.debounce, global.emit, global.empty, global.render);
    global.propertiesInit = mod.exports;
  }
})(this, function (module, exports, _objectAssign, _dashCase, _data, _debounce, _emit, _empty, _render) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  exports.default = function (opts) {
    opts = opts || {};

    if (typeof opts === 'function') {
      opts = { coerce: opts };
    }

    return function (name) {
      return createNativePropertyDefinition(name, (0, _objectAssign2.default)({
        deserialize: function deserialize(value) {
          return value;
        },
        serialize: function serialize(value) {
          return value;
        }
      }, opts));
    };
  };

  var _objectAssign2 = _interopRequireDefault(_objectAssign);

  var _dashCase2 = _interopRequireDefault(_dashCase);

  var _data2 = _interopRequireDefault(_data);

  var _debounce2 = _interopRequireDefault(_debounce);

  var _emit2 = _interopRequireDefault(_emit);

  var _empty2 = _interopRequireDefault(_empty);

  var _render2 = _interopRequireDefault(_render);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  var $debounce = Symbol();

  function getDefaultValue(elem, name, opts) {
    return typeof opts.default === 'function' ? opts.default(elem, {
      name: name
    }) : opts.default;
  }

  function getInitialValue(elem, name, opts) {
    typeof opts.initial === 'function' ? opts.initial(elem, {
      name: name
    }) : opts.initial;
  }

  function getLinkedAttribute(name, attr) {
    return attr === true ? (0, _dashCase2.default)(name) : attr;
  }

  function syncAttribute(elem, propertyName, attributeName, newValue, opts) {
    if (!attributeName) {
      return;
    }

    var serializedValue = opts.serialize(newValue);

    if ((0, _empty2.default)(serializedValue)) {
      elem.removeAttribute(attributeName);
    } else {
      elem.setAttribute(attributeName, serializedValue);
    }
  }

  function createNativePropertyDefinition(name, opts) {
    var prop = {
      configurable: true,
      enumerable: true
    };

    prop.created = function (elem) {
      var propertyData = (0, _data2.default)(elem, 'api/property/' + name);
      var attributeName = getLinkedAttribute(name, opts.attribute);
      var initialValue = elem[name];
      (0, _data2.default)(elem, 'attributeLinks')[attributeName] = name;
      (0, _data2.default)(elem, 'propertyLinks')[name] = attributeName;

      if ((0, _empty2.default)(initialValue)) {
        if (attributeName && elem.hasAttribute(attributeName)) {
          initialValue = opts.deserialize(elem.getAttribute(attributeName));
        } else if ('initial' in opts) {
          initialValue = getInitialValue(elem, name, opts);
        } else if ('default' in opts) {
          initialValue = getDefaultValue(elem, name, opts);
        }
      }

      var internalValue = propertyData.internalValue = opts.coerce ? opts.coerce(initialValue) : initialValue;
      syncAttribute(elem, name, attributeName, internalValue, opts);
    };

    prop.get = function () {
      var propertyData = (0, _data2.default)(this, 'api/property/' + name);
      var internalValue = propertyData.internalValue;

      if (typeof opts.get === 'function') {
        return opts.get(this, {
          name: name,
          internalValue: internalValue
        });
      }

      return internalValue;
    };

    prop.render = function () {
      var shouldUpdate = opts.render;

      if (typeof shouldUpdate === 'undefined') {
        return function (elem, data) {
          return data.newValue !== data.oldValue;
        };
      }

      if (typeof shouldUpdate === 'function') {
        return shouldUpdate;
      }

      return function () {
        return !!shouldUpdate;
      };
    }();

    prop.set = function (newValue) {
      var propertyData = (0, _data2.default)(this, 'api/property/' + name);

      if (propertyData.settingProperty) {
        return;
      }

      var attributeName = (0, _data2.default)(this, 'propertyLinks')[name];
      var oldValue = propertyData.oldValue;
      propertyData.settingProperty = true;

      if ((0, _empty2.default)(newValue)) {
        newValue = getDefaultValue(this, name, opts);
      }

      if (typeof opts.coerce === 'function') {
        newValue = opts.coerce(newValue);
      }

      var propertyHasChanged = newValue !== oldValue;

      if (propertyHasChanged && opts.event) {
        var cancelledEvents = (0, _emit2.default)(this, String(opts.event), {
          bubbles: false,
          cancelable: true,
          detail: {
            name: name,
            oldValue: oldValue,
            newValue: newValue
          }
        });

        if (cancelledEvents.length > 0) {
          propertyData.settingProperty = false;
          return;
        }
      }

      propertyData.internalValue = newValue;
      syncAttribute(this, name, attributeName, newValue, opts);
      var changeData = {
        name: name,
        newValue: newValue,
        oldValue: oldValue
      };

      if (typeof opts.set === 'function') {
        opts.set(this, changeData);
      }

      if (prop.render(this, changeData)) {
        var deb = this[$debounce] || (this[$debounce] = (0, _debounce2.default)(_render2.default, 1));
        deb(this);
      }

      propertyData.settingProperty = false;
      propertyData.oldValue = newValue;
    };

    return prop;
  }

  module.exports = exports['default'];
});