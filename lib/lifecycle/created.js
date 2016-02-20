(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['module', 'exports', '../util/data', './events', './patch-attribute-methods', './properties-init', './properties-created', './properties-ready', './prototype', './resolve'], factory);
  } else if (typeof exports !== "undefined") {
    factory(module, exports, require('../util/data'), require('./events'), require('./patch-attribute-methods'), require('./properties-init'), require('./properties-created'), require('./properties-ready'), require('./prototype'), require('./resolve'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod, mod.exports, global.data, global.events, global.patchAttributeMethods, global.propertiesInit, global.propertiesCreated, global.propertiesReady, global.prototype, global.resolve);
    global.created = mod.exports;
  }
})(this, function (module, exports, _data, _events, _patchAttributeMethods, _propertiesInit, _propertiesCreated, _propertiesReady, _prototype, _resolve) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  exports.default = function (opts) {
    var attribute = opts.attribute;
    var created = opts.created;
    var events = opts.events;
    var isNative = opts.isNative;
    var properties = opts.properties;
    var prototype = opts.prototype;
    var ready = opts.ready;
    var render = opts.render;
    var resolvedAttribute = opts.resolvedAttribute;

    var applyEvents = (0, _events2.default)(opts);
    var applyPrototype = (0, _prototype2.default)(opts);
    var propertyFunctions = ensurePropertyFunctions(opts);

    // Performance critical code!
    return function () {
      var info = (0, _data2.default)(this);
      var resolved = this.hasAttribute(resolvedAttribute);
      var propertyDefinitions = properties ? ensurePropertyDefinitions(this, propertyFunctions) : null;
      var readyCallbacks = info.readyCallbacks;

      if (info.created) {
        return;
      }

      info.created = true;

      if (!isNative) {
        if (attribute) {
          (0, _patchAttributeMethods2.default)(this);
        }

        if (prototype) {
          applyPrototype(this);
        }
      }

      if (propertyDefinitions) {
        (0, _propertiesCreated2.default)(this, propertyDefinitions);
      }

      if (events) {
        applyEvents(this);
      }

      if (created) {
        created(this);
      }

      if (render && !resolved) {
        render(this);
      }

      if (propertyDefinitions) {
        (0, _propertiesReady2.default)(this, propertyDefinitions);
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

      if (!resolved) {
        (0, _resolve2.default)(this, opts);
      }
    };
  };

  var _data2 = _interopRequireDefault(_data);

  var _events2 = _interopRequireDefault(_events);

  var _patchAttributeMethods2 = _interopRequireDefault(_patchAttributeMethods);

  var _propertiesInit2 = _interopRequireDefault(_propertiesInit);

  var _propertiesCreated2 = _interopRequireDefault(_propertiesCreated);

  var _propertiesReady2 = _interopRequireDefault(_propertiesReady);

  var _prototype2 = _interopRequireDefault(_prototype);

  var _resolve2 = _interopRequireDefault(_resolve);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  // TODO Remove this when we no longer support the legacy definitions and only
  // support a superset of a native property definition.
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

  module.exports = exports['default'];
});