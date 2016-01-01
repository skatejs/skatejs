(function (global, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['exports', 'module', 'object-assign', '../util/dash-case', '../util/data', '../util/empty'], factory);
  } else if (typeof exports !== 'undefined' && typeof module !== 'undefined') {
    factory(exports, module, require('object-assign'), require('../util/dash-case'), require('../util/data'), require('../util/empty'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, mod, global.assign, global.dashCase, global.data, global.empty);
    global.propertiesInit = mod.exports;
  }
})(this, function (exports, module, _objectAssign, _utilDashCase, _utilData, _utilEmpty) {
  'use strict';

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  var _assign = _interopRequireDefault(_objectAssign);

  var _dashCase = _interopRequireDefault(_utilDashCase);

  var _data = _interopRequireDefault(_utilData);

  var _empty = _interopRequireDefault(_utilEmpty);

  var _window$Element$prototype = window.Element.prototype;
  var removeAttribute = _window$Element$prototype.removeAttribute;
  var setAttribute = _window$Element$prototype.setAttribute;

  function getData(elem, name) {
    return (0, _data['default'])(elem, 'api/property/' + name);
  }

  function getDataForAttribute(elem, name) {
    return getData(elem, getData(elem, name).linkedProperty);
  }

  function getLinkedAttribute(name, attr) {
    return attr === true ? (0, _dashCase['default'])(name) : attr;
  }

  function createNativePropertyDefinition(name, opts) {
    var prop = {
      configurable: true,
      enumerable: true
    };

    prop.created = function (elem, initialValue) {
      var info = getData(elem, name);
      info.linkedAttribute = getLinkedAttribute(name, opts.attribute);
      info.opts = opts;
      info.updatingProperty = false;

      // Ensure we can get the info from inside the attribute methods.
      getData(elem, info.linkedAttribute).linkedProperty = name;

      if (typeof opts['default'] === 'function') {
        info.defaultValue = opts['default'](elem);
      } else if (!(0, _empty['default'])(opts['default'])) {
        info.defaultValue = opts['default'];
      }

      // TODO Refactor to be cleaner.
      //
      // We only override removeAttribute and setAttribute once. This means that
      // if you define 10 properties, they still only get overridden once. For
      // this reason, we must re-get info / opts from within the property methods
      // since the functions aren't recreated for each scope.
      if (info.linkedAttribute) {
        if (!info.attributeMap) {
          info.attributeMap = {};

          elem.removeAttribute = function (attrName) {
            var info = getDataForAttribute(this, attrName);

            if (!info.linkedAttribute) {
              return removeAttribute.call(this, attrName);
            }

            var prop = info.attributeMap[attrName];
            var serializedValue = info.opts.serialize(info.defaultValue);
            info.updatingAttribute = true;

            if ((0, _empty['default'])(serializedValue)) {
              removeAttribute.call(this, attrName);
            } else {
              setAttribute.call(this, attrName, serializedValue);
            }

            if (prop) {
              elem[prop] = undefined;
            }

            info.updatingAttribute = false;
          };

          elem.setAttribute = function (attrName, attrValue) {
            var info = getDataForAttribute(this, attrName);

            if (!info.linkedAttribute) {
              return setAttribute.call(this, attrName, attrValue);
            }

            var prop = info.attributeMap[attrName];
            info.updatingAttribute = true;
            setAttribute.call(this, attrName, attrValue);

            if (prop) {
              elem[prop] = info.opts.deserialize(attrValue);
            }

            info.updatingAttribute = false;
          };
        }

        info.attributeMap[info.linkedAttribute] = name;
      }

      // Set up initial value if it wasn't specified.
      if ((0, _empty['default'])(initialValue)) {
        if (info.linkedAttribute && elem.hasAttribute(info.linkedAttribute)) {
          initialValue = opts.deserialize(elem.getAttribute(info.linkedAttribute));
        } else {
          initialValue = info.defaultValue;
        }
      }

      // We must coerce the initial value just in case it wasn't already.
      info.internalValue = opts.coerce ? opts.coerce(initialValue) : initialValue;

      // User-defined created callback.
      if (typeof opts.created === 'function') {
        opts.created(elem, initialValue);
      }
    };

    prop.get = function () {
      var info = getData(this, name);
      var internalValue = info.internalValue;

      if (opts.get) {
        return opts.get(this, { name: name, internalValue: internalValue });
      }

      return internalValue;
    };

    prop.init = function () {
      var init = getData(this, name).internalValue;
      this[name] = (0, _empty['default'])(init) ? this[name] : init;
    };

    prop.set = function (newValue) {
      var info = getData(this, name);
      var oldValue = info.oldValue;

      if (info.updatingProperty) {
        return;
      }

      info.updatingProperty = true;

      if ((0, _empty['default'])(newValue)) {
        newValue = info.defaultValue;
      }

      if (typeof opts.coerce === 'function') {
        newValue = opts.coerce(newValue);
      }

      info.internalValue = newValue;

      if (info.linkedAttribute && !info.updatingAttribute) {
        var serializedValue = opts.serialize(newValue);
        if ((0, _empty['default'])(serializedValue)) {
          removeAttribute.call(this, info.linkedAttribute);
        } else {
          setAttribute.call(this, info.linkedAttribute, serializedValue);
        }
      }

      if (typeof opts.set === 'function') {
        opts.set(this, { name: name, newValue: newValue, oldValue: oldValue });
      }

      info.oldValue = newValue;
      info.updatingProperty = false;
    };

    return prop;
  }

  module.exports = function (opts) {
    opts = opts || {};

    if (typeof opts === 'function') {
      opts = { coerce: opts };
    }

    return function (name) {
      return createNativePropertyDefinition(name, (0, _assign['default'])({
        deserialize: function deserialize(value) {
          return value;
        },
        serialize: function serialize(value) {
          return value;
        }
      }, opts));
    };
  };
});