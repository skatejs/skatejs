(function (global, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['exports', 'module', '../util/assign-safe', '../util/data', './events', './properties', '../util/protos', '../global/registry', './render', '../util/walk-tree'], factory);
  } else if (typeof exports !== 'undefined' && typeof module !== 'undefined') {
    factory(exports, module, require('../util/assign-safe'), require('../util/data'), require('./events'), require('./properties'), require('../util/protos'), require('../global/registry'), require('./render'), require('../util/walk-tree'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, mod, global.assignSafe, global.data, global.events, global.properties, global.protos, global.registry, global.render, global.walkTree);
    global.created = mod.exports;
  }
})(this, function (exports, module, _utilAssignSafe, _utilData, _events, _properties, _utilProtos, _globalRegistry, _render, _utilWalkTree) {
  'use strict';

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  var _assignSafe = _interopRequireDefault(_utilAssignSafe);

  var _data = _interopRequireDefault(_utilData);

  var _events2 = _interopRequireDefault(_events);

  var _properties2 = _interopRequireDefault(_properties);

  var _protos = _interopRequireDefault(_utilProtos);

  var _registry = _interopRequireDefault(_globalRegistry);

  var _render2 = _interopRequireDefault(_render);

  var _walkTree = _interopRequireDefault(_utilWalkTree);

  var elProto = window.Element.prototype;
  var oldSetAttribute = elProto.setAttribute;
  var oldRemoveAttribute = elProto.removeAttribute;

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

  function callCreatedOnDescendants(elem, id) {
    (0, _walkTree['default'])(elem.childNodes, function (child) {
      _registry['default'].find(child).forEach(function (Ctor) {
        return Ctor.prototype.createdCallback.call(child);
      });
    }, function (child) {
      return !(0, _data['default'])(child, id).created;
    });
  }

  function createCallUpdateOnProperties(opts) {
    var props = opts.properties || {};
    var names = Object.keys(props);
    return function (elem) {
      names.forEach(function (name) {
        var prop = props[name];
        var update = prop && prop.update;
        var val = elem[name];
        if (prop && prop.type) {
          val = prop.type === Boolean && elem.hasAttribute(typeof prop.attr === 'string' ? prop.attr : name) || prop.type(val);
        }
        update && update.call(elem, val);
      });
    };
  }

  function markAsResolved(elem, resolvedAttribute, unresolvedAttribute) {
    elem.removeAttribute(unresolvedAttribute);
    elem.setAttribute(resolvedAttribute, '');
  }

  module.exports = function (opts) {
    var created = opts.created;
    var isNative = opts.isNative;
    var callUpdateOnProperties = createCallUpdateOnProperties(opts);
    var prototype = applyPrototype(opts.prototype);
    var ready = opts.ready;

    return function () {
      var info = (0, _data['default'])(this, opts.id);
      var isResolved = this.hasAttribute(opts.resolvedAttribute);

      if (info.created) return;
      info.created = true;

      isNative || patchAttributeMethods(this);
      isNative || prototype.call(this);
      opts.created && created.call(this);
      _properties2['default'].call(this, opts.properties);
      _events2['default'].call(this, opts.events);
      (0, _render2['default'])(this, opts);
      callCreatedOnDescendants(this, opts.id);
      callUpdateOnProperties(this);
      opts.ready && ready.call(this);
      isResolved || markAsResolved(this, opts.resolvedAttribute, opts.unresolvedAttribute);
    };
  };
});