(function (global, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['exports', 'module', '../api/event', '../api/property', '../util/assign-safe', '../util/data', '../util/protos', '../polyfill/registry', '../util/walk-tree'], factory);
  } else if (typeof exports !== 'undefined' && typeof module !== 'undefined') {
    factory(exports, module, require('../api/event'), require('../api/property'), require('../util/assign-safe'), require('../util/data'), require('../util/protos'), require('../polyfill/registry'), require('../util/walk-tree'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, mod, global.apiEvent, global.apiProperty, global.assignSafe, global.data, global.protos, global.registry, global.walkTree);
    global.unknown = mod.exports;
  }
})(this, function (exports, module, _apiEvent, _apiProperty, _utilAssignSafe, _utilData, _utilProtos, _polyfillRegistry, _utilWalkTree) {
  'use strict';

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  var _apiEvent2 = _interopRequireDefault(_apiEvent);

  var _apiProperty2 = _interopRequireDefault(_apiProperty);

  var _assignSafe = _interopRequireDefault(_utilAssignSafe);

  var _data = _interopRequireDefault(_utilData);

  var _protos = _interopRequireDefault(_utilProtos);

  var _registry = _interopRequireDefault(_polyfillRegistry);

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

  function markAsResolved(elem, opts) {
    elem.removeAttribute(opts.unresolvedAttribute);
    elem.setAttribute(opts.resolvedAttribute, '');
  }

  function applyPrototype(elem, opts) {
    (0, _protos['default'])(opts.prototype).forEach(function (proto) {
      if (!proto.isPrototypeOf(elem)) {
        (0, _assignSafe['default'])(elem, proto);
      }
    });
  }

  function template(elem, opts) {
    if (opts.template && !elem.hasAttribute(opts.resolvedAttribute)) {
      opts.template.call(elem);
    }
  }

  function callCreatedOnDescendants(elem, opts) {
    (0, _walkTree['default'])(elem.childNodes, function (elem) {
      _registry['default'].getForElement(elem).forEach(function (Ctor) {
        return Ctor.prototype.createdCallback.call(elem);
      });
    }, function (elem) {
      return !(0, _data['default'])(elem, opts.id).created;
    });
  }

  function callCreated(elem, opts) {
    if (opts.created) {
      opts.created.call(elem);
    }
  }

  module.exports = function (opts) {
    /* jshint expr: true */
    return function () {
      var info = (0, _data['default'])(this, opts.id);
      var isNative = this.createdCallback;

      if (info.created) {
        return;
      }

      info.created = true;
      isNative || applyPrototype(this, opts);
      (0, _apiProperty2['default'])(this, opts.properties);
      template(this, opts);
      isNative || callCreatedOnDescendants(this, opts);
      isNative || patchAttributeMethods(this);
      (0, _apiEvent2['default'])(this, opts.events);
      callCreated(this, opts);
      triggerAttributesCreated(this);
      markAsResolved(this, opts);
    };
  };
});