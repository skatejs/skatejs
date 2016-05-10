(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['module', 'exports', '../util/data', './events', './patch-attribute-methods', './properties-init', './prototype', '../native/support'], factory);
  } else if (typeof exports !== "undefined") {
    factory(module, exports, require('../util/data'), require('./events'), require('./patch-attribute-methods'), require('./properties-init'), require('./prototype'), require('../native/support'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod, mod.exports, global.data, global.events, global.patchAttributeMethods, global.propertiesInit, global.prototype, global.support);
    global.created = mod.exports;
  }
})(this, function (module, exports, _data, _events, _patchAttributeMethods, _propertiesInit, _prototype, _support) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  exports.default = function (opts) {
    var created = opts.created;
    var definedAttribute = opts.definedAttribute;
    var events = opts.events;
    var properties = opts.properties;
    var prototype = opts.prototype;
    var ready = opts.ready;
    var render = opts.render;
    var renderedAttribute = opts.renderedAttribute;

    var applyEvents = (0, _events2.default)(opts);
    var applyPrototype = (0, _prototype2.default)(opts);
    var propertyFunctions = ensurePropertyFunctions(opts);

    // Performance critical code!
    return function () {
      var info = (0, _data2.default)(this);
      var propertyDefinitions = properties ? ensurePropertyDefinitions(this, propertyFunctions) : null;
      var readyCallbacks = info.readyCallbacks;

      if (info.created) {
        return;
      }

      info.created = true;

      if (_support2.default.polyfilled) {
        (0, _patchAttributeMethods2.default)(this);

        if (prototype) {
          applyPrototype(this);
        }
      }

      if (propertyDefinitions) {
        iniitaliseProperties(this, propertyDefinitions);
      }

      if (events) {
        applyEvents(this);
      }

      if (created) {
        created(this);
      }

      if (render && !this.hasAttribute(renderedAttribute)) {
        render(this);
      }

      if (ready) {
        ready(this);
      }

      if (readyCallbacks) {
        readyCallbacks.forEach(function (cb) {
          return cb();
        });
        info.readyCallbacks = null;
      }

      if (!this.hasAttribute(definedAttribute)) {
        this.setAttribute(definedAttribute, '');
      }
    };
  };

  var _data2 = _interopRequireDefault(_data);

  var _events2 = _interopRequireDefault(_events);

  var _patchAttributeMethods2 = _interopRequireDefault(_patchAttributeMethods);

  var _propertiesInit2 = _interopRequireDefault(_propertiesInit);

  var _prototype2 = _interopRequireDefault(_prototype);

  var _support2 = _interopRequireDefault(_support);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  function ensurePropertyFunctions(opts) {
    var properties = opts.properties;
    var names = Object.keys(properties || {});
    return names.reduce(function (descriptors, descriptorName) {
      descriptors[descriptorName] = opts.properties[descriptorName];

      if (typeof descriptors[descriptorName] !== 'function') {
        descriptors[descriptorName] = (0, _propertiesInit2.default)(descriptors[descriptorName]);
      }

      return descriptors;
    }, {});
  }

  function ensurePropertyDefinitions(elem, propertyFunctions) {
    return Object.keys(propertyFunctions || {}).reduce(function (descriptors, descriptorName) {
      descriptors[descriptorName] = propertyFunctions[descriptorName](descriptorName);
      return descriptors;
    }, {});
  }

  function iniitaliseProperties(elem, propertyDefinitions) {
    Object.keys(propertyDefinitions).forEach(function (name) {
      var prop = propertyDefinitions[name];
      prop.created(elem);
      Object.defineProperty(elem, name, prop);
    });
  }

  module.exports = exports['default'];
});