(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['module', 'exports', './api/create', './api/emit', './api/fragment', './api/init', './api/properties/index', './api/ready', './api/render', './api/version', 'object-assign', './lifecycle/attached', './lifecycle/attribute', './lifecycle/created', './native/create-element', './defaults', './lifecycle/detached', './shared/document-observer', './native/register-element', './shared/registry', './type/element', './util/get-all-property-descriptors', './util/get-own-property-descriptors', './util/debounce', './util/define-properties', './util/walk-tree'], factory);
  } else if (typeof exports !== "undefined") {
    factory(module, exports, require('./api/create'), require('./api/emit'), require('./api/fragment'), require('./api/init'), require('./api/properties/index'), require('./api/ready'), require('./api/render'), require('./api/version'), require('object-assign'), require('./lifecycle/attached'), require('./lifecycle/attribute'), require('./lifecycle/created'), require('./native/create-element'), require('./defaults'), require('./lifecycle/detached'), require('./shared/document-observer'), require('./native/register-element'), require('./shared/registry'), require('./type/element'), require('./util/get-all-property-descriptors'), require('./util/get-own-property-descriptors'), require('./util/debounce'), require('./util/define-properties'), require('./util/walk-tree'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod, mod.exports, global.create, global.emit, global.fragment, global.init, global.index, global.ready, global.render, global.version, global.objectAssign, global.attached, global.attribute, global.created, global.createElement, global.defaults, global.detached, global.documentObserver, global.registerElement, global.registry, global.element, global.getAllPropertyDescriptors, global.getOwnPropertyDescriptors, global.debounce, global.defineProperties, global.walkTree);
    global.index = mod.exports;
  }
})(this, function (module, exports, _create, _emit, _fragment, _init, _index, _ready, _render, _version, _objectAssign, _attached, _attribute, _created, _createElement, _defaults, _detached, _documentObserver, _registerElement, _registry, _element, _getAllPropertyDescriptors, _getOwnPropertyDescriptors, _debounce, _defineProperties, _walkTree) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _create2 = _interopRequireDefault(_create);

  var _emit2 = _interopRequireDefault(_emit);

  var _fragment2 = _interopRequireDefault(_fragment);

  var _init2 = _interopRequireDefault(_init);

  var _index2 = _interopRequireDefault(_index);

  var _ready2 = _interopRequireDefault(_ready);

  var _render2 = _interopRequireDefault(_render);

  var _version2 = _interopRequireDefault(_version);

  var _objectAssign2 = _interopRequireDefault(_objectAssign);

  var _attached2 = _interopRequireDefault(_attached);

  var _attribute2 = _interopRequireDefault(_attribute);

  var _created2 = _interopRequireDefault(_created);

  var _createElement2 = _interopRequireDefault(_createElement);

  var _defaults2 = _interopRequireDefault(_defaults);

  var _detached2 = _interopRequireDefault(_detached);

  var _documentObserver2 = _interopRequireDefault(_documentObserver);

  var _registerElement2 = _interopRequireDefault(_registerElement);

  var _registry2 = _interopRequireDefault(_registry);

  var _element2 = _interopRequireDefault(_element);

  var _getAllPropertyDescriptors2 = _interopRequireDefault(_getAllPropertyDescriptors);

  var _getOwnPropertyDescriptors2 = _interopRequireDefault(_getOwnPropertyDescriptors);

  var _debounce2 = _interopRequireDefault(_debounce);

  var _defineProperties2 = _interopRequireDefault(_defineProperties);

  var _walkTree2 = _interopRequireDefault(_walkTree);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  var HTMLElement = window.HTMLElement;

  // A function that initialises the document once in a given event loop.
  var initDocument = (0, _debounce2.default)(function () {
    (0, _walkTree2.default)(document.documentElement.childNodes, function (element) {
      var component = _registry2.default.find(element);
      if (component) {
        if (component.prototype.createdCallback) {
          component.prototype.createdCallback.call(element);
        }

        if (component.prototype.attachedCallback) {
          component.prototype.attachedCallback.call(element);
        }
      }
    });
  });

  // Creates a configurable, non-writable, non-enumerable property.
  function fixedProp(obj, name, value) {
    Object.defineProperty(obj, name, {
      configurable: true,
      enumerable: false,
      value: value,
      writable: false
    });
  }

  // Makes a function / constructor that can be called as either.
  function makeCtor(name, opts) {
    var func = _create2.default.bind(null, name);

    // Assigning defaults gives a predictable definition and prevents us from
    // having to do defaults checks everywhere.
    (0, _objectAssign2.default)(func, _defaults2.default);

    // Inherit all options. This takes into account object literals as well as
    // ES2015 classes that may have inherited static props which would not be
    // considered "own".
    (0, _defineProperties2.default)(func, (0, _getAllPropertyDescriptors2.default)(opts));

    // Fixed info.
    fixedProp(func.prototype, 'constructor', func);
    fixedProp(func, 'id', name);
    fixedProp(func, 'isNative', func.type === _element2.default && _registerElement2.default);

    // In native, the function name is the same as the custom element name, but
    // WebKit prevents this from being defined. We do this where possible and
    // still define `id` for cross-browser compatibility.
    var nameProp = Object.getOwnPropertyDescriptor(func, 'name');
    if (nameProp && nameProp.configurable) {
      fixedProp(func, 'name', name);
    }

    return func;
  }

  // The main skate() function.
  function skate(name, opts) {
    var Ctor = makeCtor(name, opts);

    // If the options don't inherit a native element prototype, we ensure it does
    // because native requires you explicitly do this. Here we solve the common
    // use case by defaulting to HTMLElement.prototype.
    if (!HTMLElement.prototype.isPrototypeOf(Ctor.prototype) && !SVGElement.prototype.isPrototypeOf(Ctor.prototype)) {
      var proto = (Ctor.extends ? (0, _createElement2.default)(Ctor.extends).constructor : HTMLElement).prototype;
      Ctor.prototype = Object.create(proto, (0, _getOwnPropertyDescriptors2.default)(Ctor.prototype));
    }

    // We not assign native callbacks to handle the callbacks specified in the
    // Skate definition. This allows us to abstract away any changes that may
    // occur in the spec.
    Ctor.prototype.createdCallback = (0, _created2.default)(Ctor);
    Ctor.prototype.attachedCallback = (0, _attached2.default)(Ctor);
    Ctor.prototype.detachedCallback = (0, _detached2.default)(Ctor);
    Ctor.prototype.attributeChangedCallback = (0, _attribute2.default)(Ctor);

    // In polyfill land we must emulate what the browser would normally do in
    // native.
    if (!Ctor.isNative) {
      initDocument();
      _documentObserver2.default.register();
    }

    // Call register hook. We could put this in the registry, but since the
    // registry is shared across versions, we try and churn that as little as
    // possible. It's fine here for now.
    var type = Ctor.type;
    if (type.register) {
      type.register(Ctor);
    }

    // We keep our own registry since we can't access the native one.
    return _registry2.default.set(name, Ctor);
  }

  // Public API.
  skate.create = _create2.default;
  skate.emit = _emit2.default;
  skate.fragment = _fragment2.default;
  skate.init = _init2.default;
  skate.properties = _index2.default;
  skate.ready = _ready2.default;
  skate.render = _render2.default;
  skate.version = _version2.default;

  exports.default = skate;
  module.exports = exports['default'];
});