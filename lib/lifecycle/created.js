(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['module', 'exports', '../util/data', '../api/emit', './events', './patch-attribute-methods', './properties-init', './properties-created', './properties-ready', './prototype', './resolve'], factory);
  } else if (typeof exports !== "undefined") {
    factory(module, exports, require('../util/data'), require('../api/emit'), require('./events'), require('./patch-attribute-methods'), require('./properties-init'), require('./properties-created'), require('./properties-ready'), require('./prototype'), require('./resolve'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod, mod.exports, global.data, global.emit, global.events, global.patchAttributeMethods, global.propertiesInit, global.propertiesCreated, global.propertiesReady, global.prototype, global.resolve);
    global.created = mod.exports;
  }
})(this, function (module, exports, _data, _emit, _events, _patchAttributeMethods, _propertiesInit, _propertiesCreated, _propertiesReady, _prototype, _resolve) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  exports.default = function (opts) {
    var applyEvents = (0, _events2.default)(opts);
    var applyPrototype = (0, _prototype2.default)(opts);
    var propertyFunctions = ensurePropertyFunctions(opts);

    return function () {
      var info = (0, _data2.default)(this, 'lifecycle/' + opts.id);
      var native = opts.isNative;
      var resolved = this.hasAttribute('resolved');

      if (info.created) return;
      info.created = true;
      var propertyDefinitions = ensurePropertyDefinitions(this, propertyFunctions);

      native || opts.attribute && (0, _patchAttributeMethods2.default)(this);
      native || opts.prototype && applyPrototype(this);
      opts.properties && (0, _propertiesCreated2.default)(this, propertyDefinitions);
      opts.events && applyEvents(this);
      opts.created && opts.created(this);
      resolved || opts.render && opts.render(this);
      opts.properties && (0, _propertiesReady2.default)(this, propertyDefinitions);
      opts.ready && opts.ready(this);
      (0, _emit2.default)(this, readyEventName, readyEventOptions);
      resolved || (0, _resolve2.default)(this, opts);
    };
  };

  var _data2 = _interopRequireDefault(_data);

  var _emit2 = _interopRequireDefault(_emit);

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

  var readyEventName = 'skate.ready';
  var readyEventOptions = {
    bubbles: false,
    cancelable: false
  };

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