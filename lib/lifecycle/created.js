(function (global, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['exports', 'module', '../api/events', '../api/properties', '../util/assign-safe', '../util/data', '../util/protos', '../global/registry', '../util/walk-tree'], factory);
  } else if (typeof exports !== 'undefined' && typeof module !== 'undefined') {
    factory(exports, module, require('../api/events'), require('../api/properties'), require('../util/assign-safe'), require('../util/data'), require('../util/protos'), require('../global/registry'), require('../util/walk-tree'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, mod, global.apiEvents, global.apiProperties, global.assignSafe, global.data, global.protos, global.registry, global.walkTree);
    global.unknown = mod.exports;
  }
})(this, function (exports, module, _apiEvents, _apiProperties, _utilAssignSafe, _utilData, _utilProtos, _globalRegistry, _utilWalkTree) {
  'use strict';

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  var _apiEvents2 = _interopRequireDefault(_apiEvents);

  var _apiProperties2 = _interopRequireDefault(_apiProperties);

  var _assignSafe = _interopRequireDefault(_utilAssignSafe);

  var _data = _interopRequireDefault(_utilData);

  var _protos = _interopRequireDefault(_utilProtos);

  var _registry = _interopRequireDefault(_globalRegistry);

  var _walkTree = _interopRequireDefault(_utilWalkTree);

  var elProto = window.Element.prototype;
  var oldSetAttribute = elProto.setAttribute;
  var oldRemoveAttribute = elProto.removeAttribute;

  function fnOr(fn) {
    var otherwise = arguments.length <= 1 || arguments[1] === undefined ? function () {} : arguments[1];

    return typeof fn === 'function' ? fn : function () {
      return otherwise(this, fn);
    };
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
    var created = fnOr(opts.created);
    var events = fnOr(opts.events, _apiEvents2['default']);
    var properties = fnOr(opts.properties, _apiProperties2['default']);
    var prototype = applyPrototype(opts.prototype);
    var ready = fnOr(opts.ready);
    var template = fnOr(opts.template);

    /* jshint expr: true */
    return function () {
      var initProps;
      var info = (0, _data['default'])(this, opts.id);
      var isNative = this.createdCallback;

      // This ensures that this component cannot be triggered more than once on
      // this element. This is also for native so that we can force-init an
      // element and when the native callback is fired it can just be a no-op.
      if (info.created) return;
      info.created = true;

      // Ensure that attribute changes are propagated synchronously.
      isNative || patchAttributeMethods(this);

      // The inheriting of the prototype is the first thing to happen in native.
      isNative || prototype.call(this);

      // Bind events so we can catch them at the earliest point in the lifecycle.
      //
      // TODO Check to see if we need to delay execution of handlers until after
      // The ready lifecycle has been invoked so that we can make sure descendants
      // are initialised and ready just in case any code in the handlers tries to
      // pass on state.
      events.call(this);

      // Apply the template to the element.
      template.call(this);

      // The properties function returns a function that can be called to
      // initialise them on the element when appropriate.
      initProps = properties.call(this);

      // Call created() on the host. This may be called at any time, so no one
      // should not rely on descendants being initialised yet. This conforms with
      // native behaviour.
      created.call(this);

      // In both polyfill and native we force init all descendant components so
      // that we can ensure that created() and ready() have been called by the
      // time ready() is called on the parent / host.
      callCreatedOnDescendants(this, opts.id);

      // Now call ready. By this time, created() and ready () have been called on
      // all descendant components because we've forcefully done it above.
      ready.call(this);

      // We trigger all property handlers for properties that exist once all
      // descendants are ready for any incoming state updates. This will also
      // trigger changes for any attributes that are properties.
      initProps();

      // Resolve after everything in the created lifecycle has run. This is so
      // that whatever needs to be done before this can be done without FOUC.
      markAsResolved(this, opts.resolvedAttribute, opts.unresolvedAttribute);
    };
  };
});