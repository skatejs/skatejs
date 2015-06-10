(function (global, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['exports', 'module', '../util/assign', '../util/data', './events', './properties', '../util/protos', '../polyfill/registry', '../util/walk-tree'], factory);
  } else if (typeof exports !== 'undefined' && typeof module !== 'undefined') {
    factory(exports, module, require('../util/assign'), require('../util/data'), require('./events'), require('./properties'), require('../util/protos'), require('../polyfill/registry'), require('../util/walk-tree'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, mod, global.assign, global.data, global.events, global.properties, global.protos, global.registry, global.walkTree);
    global.unknown = mod.exports;
  }
})(this, function (exports, module, _utilAssign, _utilData, _events, _properties, _utilProtos, _polyfillRegistry, _utilWalkTree) {
  'use strict';

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  var _assign = _interopRequireDefault(_utilAssign);

  var _data = _interopRequireDefault(_utilData);

  var _events2 = _interopRequireDefault(_events);

  var _properties2 = _interopRequireDefault(_properties);

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
    for (var attr in attrs) {
      attr = attrs[attr];
      elem.attributeChangedCallback(attr.nodeName, null, attr.value || attr.nodeValue);
    }
  }

  function markAsResolved(elem, opts) {
    elem.removeAttribute(opts.unresolvedAttribute);
    elem.setAttribute(opts.resolvedAttribute, '');
  }

  function initAttributes(elem) {
    var attrs = arguments[1] === undefined ? {} : arguments[1];

    Object.keys(attrs).forEach(function (name) {
      var attr = attrs[name];
      if (attr && attr.value && !elem.hasAttribute(name)) {
        var value = attr.value;
        value = typeof value === 'function' ? value(elem) : value;
        elem.setAttribute(name, value);
      }
    });
  }

  function applyPrototype(elem, opts) {
    (0, _protos['default'])(opts.prototype).forEach(function (proto) {
      if (!proto.isPrototypeOf(elem)) {
        (0, _assign['default'])(elem, proto);
      }
    });
  }

  function template(elem, opts) {
    if (opts.template && !elem.hasAttribute(opts.resolvedAttribute)) {
      opts.template(elem);
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
      opts.created(elem);
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
      (0, _properties2['default'])(this, opts.properties);
      template(this, opts);
      isNative || callCreatedOnDescendants(this, opts);
      isNative || patchAttributeMethods(this);
      (0, _events2['default'])(this, opts.events);
      initAttributes(this, opts.attributes);
      callCreated(this, opts);
      triggerAttributesCreated(this);
      markAsResolved(this, opts);
    };
  };
});