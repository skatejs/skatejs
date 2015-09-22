(function (global, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['exports', 'module', '../util/dash-case', '../util/data', '../api/emit'], factory);
  } else if (typeof exports !== 'undefined' && typeof module !== 'undefined') {
    factory(exports, module, require('../util/dash-case'), require('../util/data'), require('../api/emit'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, mod, global.dashCase, global.data, global.emit);
    global.property = mod.exports;
  }
})(this, function (exports, module, _utilDashCase, _utilData, _apiEmit) {
  'use strict';

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  var _dashCase = _interopRequireDefault(_utilDashCase);

  var _data = _interopRequireDefault(_utilData);

  var _emit = _interopRequireDefault(_apiEmit);

  // TODO Decouple boolean attributes from the Boolean function.
  // TODO Split apart createNativePropertyDefinition function.

  function getLinkedAttribute(name, attr) {
    return attr === true ? (0, _dashCase['default'])(name) : attr;
  }

  function createNativePropertyDefinition(name, opts) {
    var prop = {};

    prop.created = function (elem, initialValue) {
      var info = (0, _data['default'])(elem, 'api/property/' + name);
      info.internalValue = initialValue;
      info.isBoolean = opts.type === Boolean;
      info.linkedAttribute = getLinkedAttribute(name, opts.attr);
      info.removeAttribute = elem.removeAttribute;
      info.setAttribute = elem.setAttribute;
      info.updatingProperty = false;

      // TODO Refactor
      if (info.linkedAttribute) {
        if (!info.attributeMap) {
          info.attributeMap = {};

          elem.removeAttribute = function (attrName) {
            info.removeAttribute.call(this, attrName);
            if (attrName in info.attributeMap) {
              elem[info.attributeMap[attrName]] = undefined;
            }
          };

          elem.setAttribute = function (attrName, attrValue) {
            info.setAttribute.call(this, attrName, attrValue);
            if (attrName in info.attributeMap) {
              elem[info.attributeMap[attrName]] = attrValue;
            }
          };
        }

        info.attributeMap[info.linkedAttribute] = name;
      }

      if (info.linkedAttribute && elem.hasAttribute(info.linkedAttribute)) {
        info.internalValue = info.isBoolean ? elem.hasAttribute(info.linkedAttribute) : elem.getAttribute(info.linkedAttribute);
      } else if (typeof opts.init === 'function') {
        info.internalValue = opts.init();
      } else if (typeof opts.init !== 'undefined') {
        info.internalValue = opts.init;
      }

      if (opts.type) {
        info.internalValue = opts.type(info.internalValue);
      }
    };

    prop.get = function () {
      var info = (0, _data['default'])(this, 'api/property/' + name);
      return info.internalValue;
    };

    prop.ready = function (elem, value) {
      if (opts.update) {
        opts.update(elem, {
          name: name,
          newValue: value,
          oldValue: null
        });
      }
    };

    prop.set = function (value) {
      var info = (0, _data['default'])(this, 'api/property/' + name);

      if (info.updatingProperty) {
        return;
      }

      info.updatingProperty = true;

      var newValue = opts.type ? opts.type(value) : value;
      var oldValue = info.internalValue;
      info.internalValue = newValue;

      if (newValue === oldValue) {
        info.updatingProperty = false;
        return;
      }

      if (info.linkedAttribute) {
        if (info.isBoolean && newValue) {
          info.setAttribute.call(this, info.linkedAttribute, '');
        } else if (value === undefined || info.isBoolean && !newValue) {
          info.removeAttribute.call(this, info.linkedAttribute, '');
        } else {
          info.setAttribute.call(this, info.linkedAttribute, newValue);
        }
      }

      var changeData = {
        name: name,
        newValue: newValue,
        oldValue: oldValue
      };

      if (opts.update) {
        opts.update(this, changeData);
      }

      if (opts.emit) {
        var eventName = opts.emit;

        if (eventName === true) {
          eventName = 'skate.property';
        }

        (0, _emit['default'])(this, eventName, {
          bubbles: false,
          cancelable: false,
          detail: changeData
        });
      }

      info.updatingProperty = false;
    };

    return prop;
  }

  module.exports = function (opts) {
    opts = opts || {};

    if (typeof opts === 'function') {
      opts = { type: opts };
    }

    return function (name) {
      return createNativePropertyDefinition(name, opts);
    };
  };
});