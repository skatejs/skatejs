(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['module', 'exports', 'object-assign', '../util/dash-case', '../util/data', '../api/emit', '../util/empty'], factory);
  } else if (typeof exports !== "undefined") {
    factory(module, exports, require('object-assign'), require('../util/dash-case'), require('../util/data'), require('../api/emit'), require('../util/empty'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod, mod.exports, global.objectAssign, global.dashCase, global.data, global.emit, global.empty);
    global.propertiesInit = mod.exports;
  }
})(this, function (module, exports, _objectAssign, _dashCase, _data, _emit, _empty) {
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

  var _emit2 = _interopRequireDefault(_emit);

  var _empty2 = _interopRequireDefault(_empty);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  var _window$Element$proto = window.Element.prototype;
  var removeAttribute = _window$Element$proto.removeAttribute;
  var setAttribute = _window$Element$proto.setAttribute;

  function getData(elem, name) {
    return (0, _data2.default)(elem, 'api/property/' + name);
  }

  function getDataForAttribute(elem, name) {
    return getData(elem, getData(elem, name).linkedProperty);
  }

  function getLinkedAttribute(name, attr) {
    return attr === true ? (0, _dashCase2.default)(name) : attr;
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
      getData(elem, info.linkedAttribute).linkedProperty = name;

      if (typeof opts.default === 'function') {
        info.defaultValue = opts.default(elem, {
          name: name
        });
      } else if (!(0, _empty2.default)(opts.default)) {
        info.defaultValue = opts.default;
      }

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

            if ((0, _empty2.default)(serializedValue)) {
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

      if ((0, _empty2.default)(initialValue)) {
        if (info.linkedAttribute && elem.hasAttribute(info.linkedAttribute)) {
          initialValue = opts.deserialize(elem.getAttribute(info.linkedAttribute));
        } else {
          initialValue = info.defaultValue;
        }
      }

      var internalValue = info.internalValue = opts.coerce ? opts.coerce(initialValue) : initialValue;

      if (typeof opts.created === 'function') {
        opts.created(elem, {
          name: name,
          internalValue: internalValue
        });
      }
    };

    prop.get = function () {
      var info = getData(this, name);
      var internalValue = info.internalValue;

      if (opts.get) {
        return opts.get(this, {
          name: name,
          internalValue: internalValue
        });
      }

      return internalValue;
    };

    prop.initial = function (elem) {
      return typeof opts.initial === 'function' ? opts.initial(elem, {
        name: name
      }) : elem[name];
    };

    prop.ready = function (elem) {
      var initial = getData(elem, name).internalValue;
      elem[name] = (0, _empty2.default)(initial) ? this.initial(elem) : initial;
    };

    prop.set = function (newValue) {
      var info = getData(this, name);
      var oldValue = info.oldValue;

      if (info.updatingProperty) {
        return;
      }

      info.updatingProperty = true;

      if ((0, _empty2.default)(newValue)) {
        newValue = info.defaultValue;
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
          info.updatingProperty = false;
          return;
        }
      }

      info.internalValue = newValue;

      if (info.linkedAttribute && !info.updatingAttribute) {
        var serializedValue = opts.serialize(newValue);

        if ((0, _empty2.default)(serializedValue)) {
          removeAttribute.call(this, info.linkedAttribute);
        } else {
          setAttribute.call(this, info.linkedAttribute, serializedValue);
        }
      }

      if (typeof opts.set === 'function') {
        opts.set(this, {
          name: name,
          newValue: newValue,
          oldValue: oldValue
        });
      }

      info.oldValue = newValue;
      info.updatingProperty = false;
    };

    return prop;
  }

  module.exports = exports['default'];
});