(function (global, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['exports', 'module', './api/create', './api/emit', './api/fragment', './api/init', './api/properties/index', './api/ready', './api/render/index', './api/version', 'object-assign', './lifecycle/attached', './lifecycle/attribute', './lifecycle/created', './defaults', './lifecycle/detached', './global/document-observer', './global/registry', './support/custom-elements', './type/element', './util/get-all-property-descriptors', './util/get-own-property-descriptors', './util/debounce', './util/define-properties', './util/walk-tree', './support/valid-custom-element'], factory);
  } else if (typeof exports !== 'undefined' && typeof module !== 'undefined') {
    factory(exports, module, require('./api/create'), require('./api/emit'), require('./api/fragment'), require('./api/init'), require('./api/properties/index'), require('./api/ready'), require('./api/render/index'), require('./api/version'), require('object-assign'), require('./lifecycle/attached'), require('./lifecycle/attribute'), require('./lifecycle/created'), require('./defaults'), require('./lifecycle/detached'), require('./global/document-observer'), require('./global/registry'), require('./support/custom-elements'), require('./type/element'), require('./util/get-all-property-descriptors'), require('./util/get-own-property-descriptors'), require('./util/debounce'), require('./util/define-properties'), require('./util/walk-tree'), require('./support/valid-custom-element'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, mod, global.apiCreate, global.apiEmit, global.apiFragment, global.apiInit, global.apiProperties, global.apiReady, global.apiRender, global.apiVersion, global.assign, global.attached, global.attribute, global.created, global.defaults, global.detached, global.documentObserver, global.registry, global.supportsCustomElements, global.typeElement, global.utilGetAllPropertyDescriptors, global.utilGetOwnPropertyDescriptors, global.utilDebounce, global.utilDefineProperties, global.utilWalkTree, global.validCustomElement);
    global.index = mod.exports;
  }
})(this, function (exports, module, _apiCreate, _apiEmit, _apiFragment, _apiInit, _apiPropertiesIndex, _apiReady, _apiRenderIndex, _apiVersion, _objectAssign, _lifecycleAttached, _lifecycleAttribute, _lifecycleCreated, _defaults, _lifecycleDetached, _globalDocumentObserver, _globalRegistry, _supportCustomElements, _typeElement, _utilGetAllPropertyDescriptors, _utilGetOwnPropertyDescriptors, _utilDebounce, _utilDefineProperties, _utilWalkTree, _supportValidCustomElement) {
  'use strict';

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  var _apiCreate2 = _interopRequireDefault(_apiCreate);

  var _apiEmit2 = _interopRequireDefault(_apiEmit);

  var _apiFragment2 = _interopRequireDefault(_apiFragment);

  var _apiInit2 = _interopRequireDefault(_apiInit);

  var _apiProperties = _interopRequireDefault(_apiPropertiesIndex);

  var _apiReady2 = _interopRequireDefault(_apiReady);

  var _apiRender = _interopRequireDefault(_apiRenderIndex);

  var _apiVersion2 = _interopRequireDefault(_apiVersion);

  var _assign = _interopRequireDefault(_objectAssign);

  var _attached = _interopRequireDefault(_lifecycleAttached);

  var _attribute = _interopRequireDefault(_lifecycleAttribute);

  var _created = _interopRequireDefault(_lifecycleCreated);

  var _defaults2 = _interopRequireDefault(_defaults);

  var _detached = _interopRequireDefault(_lifecycleDetached);

  var _documentObserver = _interopRequireDefault(_globalDocumentObserver);

  var _registry = _interopRequireDefault(_globalRegistry);

  var _supportsCustomElements = _interopRequireDefault(_supportCustomElements);

  var _typeElement2 = _interopRequireDefault(_typeElement);

  var _utilGetAllPropertyDescriptors2 = _interopRequireDefault(_utilGetAllPropertyDescriptors);

  var _utilGetOwnPropertyDescriptors2 = _interopRequireDefault(_utilGetOwnPropertyDescriptors);

  var _utilDebounce2 = _interopRequireDefault(_utilDebounce);

  var _utilDefineProperties2 = _interopRequireDefault(_utilDefineProperties);

  var _utilWalkTree2 = _interopRequireDefault(_utilWalkTree);

  var _validCustomElement = _interopRequireDefault(_supportValidCustomElement);

  var HTMLElement = window.HTMLElement;

  // A function that initialises the document once in a given event loop.
  var initDocument = (0, _utilDebounce2['default'])(function () {
    // For performance in older browsers, we use:
    //
    // - childNodes instead of children
    // - for instead of forEach
    (0, _utilWalkTree2['default'])(document.documentElement.childNodes, function (element) {
      var components = _registry['default'].find(element);
      var componentsLength = components.length;

      // Created callbacks are called first.
      for (var a = 0; a < componentsLength; a++) {
        components[a].prototype.createdCallback.call(element);
      }

      // Attached callbacks are called separately because this emulates how
      // native works internally.
      for (var a = 0; a < componentsLength; a++) {
        components[a].prototype.attachedCallback.call(element);
      }
    });
  });

  // Creates a configurable, non-writable, non-enumerable property.
  function fixedProp(obj, name, value) {
    Object.defineProperty(obj, name, {
      configurable: true,
      enumerable: false, value: value,
      writable: false
    });
  }

  // Makes a function / constructor that can be called as either.
  function makeCtor(name, opts) {
    var func = _apiCreate2['default'].bind(null, name);

    // Assigning defaults gives a predictable definition and prevents us from
    // having to do defaults checks everywhere.
    (0, _assign['default'])(func, _defaults2['default']);

    // Inherit all options. This takes into account object literals as well as
    // ES2015 classes that may have inherited static props which would not be
    // considered "own".
    (0, _utilDefineProperties2['default'])(func, (0, _utilGetAllPropertyDescriptors2['default'])(opts));

    // Fixed info.
    fixedProp(func.prototype, 'constructor', func);
    fixedProp(func, 'id', name);
    fixedProp(func, 'isNative', func.type === _typeElement2['default'] && (0, _supportsCustomElements['default'])() && (0, _validCustomElement['default'])(name));

    // *sigh* WebKit
    //
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
    var proto = (Ctor['extends'] ? document.createElement(Ctor['extends']).constructor : HTMLElement).prototype;

    // If the options don't inherit a native element prototype, we ensure it does
    // because native unnecessarily requires you explicitly do this.
    if (!proto.isPrototypeOf(Ctor.prototype)) {
      Ctor.prototype = Object.create(proto, (0, _utilGetOwnPropertyDescriptors2['default'])(Ctor.prototype));
    }

    // We not assign native callbacks to handle the callbacks specified in the
    // Skate definition. This allows us to abstract away any changes that may
    // occur in the spec.
    Ctor.prototype.createdCallback = (0, _created['default'])(Ctor);
    Ctor.prototype.attachedCallback = (0, _attached['default'])(Ctor);
    Ctor.prototype.detachedCallback = (0, _detached['default'])(Ctor);
    Ctor.prototype.attributeChangedCallback = (0, _attribute['default'])(Ctor);

    // In native, we have to massage the definition so that the browser doesn't
    // spit out errors for a malformed definition. In polyfill land we must
    // emulate what the browser would normally do in native.
    if (Ctor.isNative) {
      var nativeDefinition = { prototype: Ctor.prototype };
      Ctor['extends'] && (nativeDefinition['extends'] = Ctor['extends']);
      document.registerElement(name, nativeDefinition);
    } else {
      initDocument();
      _documentObserver['default'].register();
    }

    // We keep our own registry since we can't access the native one.
    return _registry['default'].set(name, Ctor);
  }

  // Public API.
  skate.create = _apiCreate2['default'];
  skate.emit = _apiEmit2['default'];
  skate.fragment = _apiFragment2['default'];
  skate.init = _apiInit2['default'];
  skate.properties = _apiProperties['default'];
  skate.ready = _apiReady2['default'];
  skate.render = _apiRender['default'];
  skate.version = _apiVersion2['default'];

  module.exports = skate;
});