(function (global, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['exports', 'module', '../util/assign-safe', '../util/data', '../lifecycle/events', '../lifecycle/properties', '../util/protos', '../global/registry', '../util/walk-tree'], factory);
  } else if (typeof exports !== 'undefined' && typeof module !== 'undefined') {
    factory(exports, module, require('../util/assign-safe'), require('../util/data'), require('../lifecycle/events'), require('../lifecycle/properties'), require('../util/protos'), require('../global/registry'), require('../util/walk-tree'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, mod, global.assignSafe, global.data, global.events, global.properties, global.protos, global.registry, global.walkTree);
    global.created = mod.exports;
  }
})(this, function (exports, module, _utilAssignSafe, _utilData, _lifecycleEvents, _lifecycleProperties, _utilProtos, _globalRegistry, _utilWalkTree) {
  'use strict';

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  var _assignSafe = _interopRequireDefault(_utilAssignSafe);

  var _data = _interopRequireDefault(_utilData);

  var _events = _interopRequireDefault(_lifecycleEvents);

  var _properties = _interopRequireDefault(_lifecycleProperties);

  var _protos = _interopRequireDefault(_utilProtos);

  var _registry = _interopRequireDefault(_globalRegistry);

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

  function markAsResolved(elem, resolvedAttribute, unresolvedAttribute) {
    elem.removeAttribute(unresolvedAttribute);
    elem.setAttribute(resolvedAttribute, '');
  }

  module.exports = function (opts) {
    var created = opts.created;
    var prototype = applyPrototype(opts.prototype);
    var ready = opts.ready;

    return function () {
      var info = (0, _data['default'])(this, opts.id);
      var isNative = this.createdCallback;
      var isResolved = this.hasAttribute(opts.resolvedAttribute);

      if (info.created) return;
      info.created = true;

      isNative || patchAttributeMethods(this);
      isNative || prototype.call(this);
      _properties['default'].call(this, opts.properties);
      _events['default'].call(this, opts.events);
      opts.created && created.call(this);
      callCreatedOnDescendants(this, opts.id);
      opts.ready && ready.call(this);
      isResolved || markAsResolved(this, opts.resolvedAttribute, opts.unresolvedAttribute);
    };
  };
});