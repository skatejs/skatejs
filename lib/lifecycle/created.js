(function (global, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['exports', 'module', '../util/assign-safe', '../util/data', './events', './property', '../util/protos', '../global/registry', '../util/walk-tree'], factory);
  } else if (typeof exports !== 'undefined' && typeof module !== 'undefined') {
    factory(exports, module, require('../util/assign-safe'), require('../util/data'), require('./events'), require('./property'), require('../util/protos'), require('../global/registry'), require('../util/walk-tree'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, mod, global.assignSafe, global.data, global.lifecycleEvents, global.lifecycleProperty, global.protos, global.registry, global.walkTree);
    global.unknown = mod.exports;
  }
})(this, function (exports, module, _utilAssignSafe, _utilData, _events, _property, _utilProtos, _globalRegistry, _utilWalkTree) {
  'use strict';

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  var _assignSafe = _interopRequireDefault(_utilAssignSafe);

  var _data = _interopRequireDefault(_utilData);

  var _lifecycleEvents = _interopRequireDefault(_events);

  var _lifecycleProperty = _interopRequireDefault(_property);

  var _protos = _interopRequireDefault(_utilProtos);

  var _registry = _interopRequireDefault(_globalRegistry);

  var _walkTree = _interopRequireDefault(_utilWalkTree);

  var elProto = window.Element.prototype;
  var oldSetAttribute = elProto.setAttribute;
  var oldRemoveAttribute = elProto.removeAttribute;

  function patchAttributeMethods(elem) {
    elem.setAttribute = function (name, newValue) {
      var oldValue = this.getAttribute(name);
      oldSetAttribute.call(elem, name, newValue);
      elem.attributeChangedCallback(name, oldValue, String(newValue));
    };

    elem.removeAttribute = function (name) {
      var oldValue = this.getAttribute(name);
      oldRemoveAttribute.call(elem, name);
      elem.attributeChangedCallback(name, oldValue, null);
    };
  }

  function triggerAttributesCreated(elem) {
    var attrs = elem.attributes;
    var attrsLength = attrs.length;
    for (var a = 0; a < attrsLength; a++) {
      var attr = attrs[a];
      elem.attributeChangedCallback(attr.name, null, attr.value);
    }
  }

  function markAsResolved(elem, resolvedAttribute, unresolvedAttribute) {
    elem.removeAttribute(unresolvedAttribute);
    elem.setAttribute(resolvedAttribute, '');
  }

  function callCreatedOnDescendants(elem, id) {
    (0, _walkTree['default'])(elem.childNodes, function (child) {
      _registry['default'].find(child).forEach(function (Ctor) {
        return Ctor.prototype.createdCallback.call(child);
      });
    }, function (child) {
      return !(0, _data['default'])(child, id).created;
    });
  }

  function fnOrApi(fn, api) {
    return typeof fn === 'function' ? fn : api(fn);
  }

  function applyPrototype(proto) {
    var prototypes = (0, _protos['default'])(proto);
    return function () {
      var _this = this;

      prototypes.forEach(function (proto) {
        if (!proto.isPrototypeOf(_this)) {
          (0, _assignSafe['default'])(_this, proto);
        }
      });
    };
  }

  module.exports = function (opts) {
    var created = opts.created;
    var events = fnOrApi(opts.events, _lifecycleEvents['default']);
    var properties = fnOrApi(opts.properties, _lifecycleProperty['default']);
    var prototype = applyPrototype(opts.prototype);
    var template = opts.template || function () {};

    /* jshint expr: true */
    return function () {
      var info = (0, _data['default'])(this, opts.id);
      var isNative = this.createdCallback;

      if (info.created) {
        return;
      }

      info.created = true;
      isNative || prototype.call(this);
      isNative || patchAttributeMethods(this);
      properties.call(this);
      template.call(this);
      callCreatedOnDescendants(this, opts.id);
      events.call(this);
      created.call(this);
      triggerAttributesCreated(this);
      markAsResolved(this, opts.resolvedAttribute, opts.unresolvedAttribute);
    };
  };
});