(function (global, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['exports', 'module', './created-on-descendants', '../util/data', './events', './patch-attribute-methods', './property', './properties-created', './properties-ready', './prototype', './renderer', './resolve'], factory);
  } else if (typeof exports !== 'undefined' && typeof module !== 'undefined') {
    factory(exports, module, require('./created-on-descendants'), require('../util/data'), require('./events'), require('./patch-attribute-methods'), require('./property'), require('./properties-created'), require('./properties-ready'), require('./prototype'), require('./renderer'), require('./resolve'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, mod, global.createdOnDescendants, global.data, global.events, global.patchAttributeMethods, global.property, global.propertiesCreated, global.propertiesReady, global.prototype, global.renderer, global.resolve);
    global.created = mod.exports;
  }
})(this, function (exports, module, _createdOnDescendants, _utilData, _events, _patchAttributeMethods, _property, _propertiesCreated, _propertiesReady, _prototype, _renderer, _resolve) {
  'use strict';

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  var _createdOnDescendants2 = _interopRequireDefault(_createdOnDescendants);

  var _data = _interopRequireDefault(_utilData);

  var _events2 = _interopRequireDefault(_events);

  var _patchAttributeMethods2 = _interopRequireDefault(_patchAttributeMethods);

  var _property2 = _interopRequireDefault(_property);

  var _propertiesCreated2 = _interopRequireDefault(_propertiesCreated);

  var _propertiesReady2 = _interopRequireDefault(_propertiesReady);

  var _prototype2 = _interopRequireDefault(_prototype);

  var _renderer2 = _interopRequireDefault(_renderer);

  var _resolve2 = _interopRequireDefault(_resolve);

  // TODO Remove this when we no longer support the legacy definitions and only
  // support a superset of a native property definition.
  function ensurePropertyFunctions(opts) {
    var props = opts.properties;
    var names = Object.keys(props || {});
    return names.reduce(function (descriptors, descriptorName) {
      descriptors[descriptorName] = opts.properties[descriptorName];
      if (typeof descriptors[descriptorName] !== 'function') {
        descriptors[descriptorName] = (0, _property2['default'])(descriptors[descriptorName]);
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

  module.exports = function (opts) {
    var applyEvents = (0, _events2['default'])(opts);
    var applyPrototype = (0, _prototype2['default'])(opts);
    var applyRenderer = (0, _renderer2['default'])(opts);
    var propertyFunctions = ensurePropertyFunctions(opts);

    return function () {
      var info = (0, _data['default'])(this, 'lifecycle/' + opts.id);
      var propertyDefinitions = undefined;

      if (info.created) return;
      info.created = true;
      propertyDefinitions = ensurePropertyDefinitions(this, propertyFunctions);

      (0, _patchAttributeMethods2['default'])(this, opts);
      applyPrototype(this);
      (0, _propertiesCreated2['default'])(this, propertyDefinitions);
      applyEvents(this);
      opts.created && opts.created(this);
      applyRenderer(this);
      (0, _createdOnDescendants2['default'])(this, opts);
      (0, _propertiesReady2['default'])(this, propertyDefinitions);
      opts.ready && opts.ready(this);
      (0, _resolve2['default'])(this, opts);
    };
  };
});