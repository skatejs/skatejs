(function (global, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['exports', 'module', './constants', './api/chain', './api/create', './api/emit', './api/event', './api/init', './api/no-conflict', './api/notify', './api/property', './api/ready', './api/type', './api/version', './api/watch', './util/assign', './util/assign-safe', './lifecycle/attached', './lifecycle/attribute', './lifecycle/created', './util/debounce', './defaults', './lifecycle/detached', './polyfill/document-observer', './polyfill/element-constructor', './polyfill/registry', './support/custom-elements', './util/walk-tree', './support/valid-custom-element'], factory);
  } else if (typeof exports !== 'undefined' && typeof module !== 'undefined') {
    factory(exports, module, require('./constants'), require('./api/chain'), require('./api/create'), require('./api/emit'), require('./api/event'), require('./api/init'), require('./api/no-conflict'), require('./api/notify'), require('./api/property'), require('./api/ready'), require('./api/type'), require('./api/version'), require('./api/watch'), require('./util/assign'), require('./util/assign-safe'), require('./lifecycle/attached'), require('./lifecycle/attribute'), require('./lifecycle/created'), require('./util/debounce'), require('./defaults'), require('./lifecycle/detached'), require('./polyfill/document-observer'), require('./polyfill/element-constructor'), require('./polyfill/registry'), require('./support/custom-elements'), require('./util/walk-tree'), require('./support/valid-custom-element'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, mod, global.constants, global.apiChain, global.apiCreate, global.apiEmit, global.apiEvent, global.apiInit, global.apiNoConflict, global.apiNotify, global.apiProperty, global.apiReady, global.apiType, global.apiVersion, global.apiWatch, global.assign, global.assignSafe, global.attached, global.attribute, global.created, global.debounce, global.defaults, global.detached, global.documentObserver, global.elementConstructor, global.registry, global.supportsCustomElements, global.walkTree, global.validCustomElement);
    global.unknown = mod.exports;
  }
})(this, function (exports, module, _constants, _apiChain, _apiCreate, _apiEmit, _apiEvent, _apiInit, _apiNoConflict, _apiNotify, _apiProperty, _apiReady, _apiType, _apiVersion, _apiWatch, _utilAssign, _utilAssignSafe, _lifecycleAttached, _lifecycleAttribute, _lifecycleCreated, _utilDebounce, _defaults, _lifecycleDetached, _polyfillDocumentObserver, _polyfillElementConstructor, _polyfillRegistry, _supportCustomElements, _utilWalkTree, _supportValidCustomElement) {
  'use strict';

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  var _apiChain2 = _interopRequireDefault(_apiChain);

  var _apiCreate2 = _interopRequireDefault(_apiCreate);

  var _apiEmit2 = _interopRequireDefault(_apiEmit);

  var _apiEvent2 = _interopRequireDefault(_apiEvent);

  var _apiInit2 = _interopRequireDefault(_apiInit);

  var _apiNoConflict2 = _interopRequireDefault(_apiNoConflict);

  var _apiNotify2 = _interopRequireDefault(_apiNotify);

  var _apiProperty2 = _interopRequireDefault(_apiProperty);

  var _apiReady2 = _interopRequireDefault(_apiReady);

  var _apiType2 = _interopRequireDefault(_apiType);

  var _apiVersion2 = _interopRequireDefault(_apiVersion);

  var _apiWatch2 = _interopRequireDefault(_apiWatch);

  var _assign = _interopRequireDefault(_utilAssign);

  var _assignSafe = _interopRequireDefault(_utilAssignSafe);

  var _attached = _interopRequireDefault(_lifecycleAttached);

  var _attribute = _interopRequireDefault(_lifecycleAttribute);

  var _created = _interopRequireDefault(_lifecycleCreated);

  var _debounce = _interopRequireDefault(_utilDebounce);

  var _defaults2 = _interopRequireDefault(_defaults);

  var _detached = _interopRequireDefault(_lifecycleDetached);

  var _documentObserver = _interopRequireDefault(_polyfillDocumentObserver);

  var _elementConstructor = _interopRequireDefault(_polyfillElementConstructor);

  var _registry = _interopRequireDefault(_polyfillRegistry);

  var _supportsCustomElements = _interopRequireDefault(_supportCustomElements);

  var _walkTree = _interopRequireDefault(_utilWalkTree);

  var _validCustomElement = _interopRequireDefault(_supportValidCustomElement);

  function initDocument() {
    (0, _walkTree['default'])(document.documentElement.childNodes, function (element) {
      var components = _registry['default'].getForElement(element);
      var componentsLength = components.length;

      for (var a = 0; a < componentsLength; a++) {
        (0, _created['default'])(components[a]).call(element);
      }

      for (var a = 0; a < componentsLength; a++) {
        (0, _attached['default'])(components[a]).call(element);
      }
    });
  }

  function initDocumentWhenReady() {
    (0, _apiReady2['default'])(initDocument);
  }

  function makeOptions(userOptions) {
    var options = (0, _assignSafe['default'])({}, _defaults2['default']);

    // Copy over all standard options if the user has defined them.
    for (var _name in _defaults2['default']) {
      if (userOptions[_name] !== undefined) {
        options[_name] = userOptions[_name];
      }
    }

    // Copy over non-standard options.
    for (var _name2 in userOptions) {
      options[_name2] = userOptions[_name2];
    }

    return options;
  }

  function makeNonNewableWrapper(Ctor) {
    var CtorWrapper = function CtorWrapper() {
      var props = arguments[0] === undefined ? {} : arguments[0];

      return (0, _assign['default'])(new Ctor(), props);
    };
    CtorWrapper.prototype = Ctor.prototype;
    return CtorWrapper;
  }

  var debouncedInitDocumentWhenReady = (0, _debounce['default'])(initDocumentWhenReady);
  var HTMLElement = window.HTMLElement;

  function skate(id, userOptions) {
    var Ctor, CtorParent, isElement, isNative;
    var options = makeOptions(userOptions);

    CtorParent = options['extends'] ? document.createElement(options['extends']).constructor : HTMLElement;
    isElement = options.type === _constants.TYPE_ELEMENT;
    isNative = isElement && (0, _supportsCustomElements['default'])() && (0, _validCustomElement['default'])(id);

    // Inherit from parent prototype.
    if (!CtorParent.prototype.isPrototypeOf(options.prototype)) {
      options.prototype = (0, _assignSafe['default'])(Object.create(CtorParent.prototype), options.prototype);
    }

    // Extend behaviour of existing callbacks.
    options.prototype.createdCallback = (0, _created['default'])(options);
    options.prototype.attachedCallback = (0, _attached['default'])(options);
    options.prototype.detachedCallback = (0, _detached['default'])(options);
    options.prototype.attributeChangedCallback = (0, _attribute['default'])(options);
    Object.defineProperty(options, 'id', {
      configurable: false,
      value: id,
      writable: false
    });

    // Make a constructor for the definition.
    if (isNative) {
      Ctor = document.registerElement(id, options);
    } else {
      Ctor = (0, _elementConstructor['default'])(options);
      debouncedInitDocumentWhenReady();
      _documentObserver['default'].register();
    }

    Ctor = makeNonNewableWrapper(Ctor);
    (0, _assignSafe['default'])(Ctor, options);
    _registry['default'].set(id, Ctor);
    Object.defineProperty(Ctor.prototype, 'constructor', {
      enumerable: false,
      value: Ctor
    });

    return Ctor;
  }

  skate.chain = _apiChain2['default'];
  skate.create = _apiCreate2['default'];
  skate.emit = _apiEmit2['default'];
  skate.event = _apiEvent2['default'];
  skate.init = _apiInit2['default'];
  skate.noConflict = _apiNoConflict2['default'];
  skate.notify = _apiNotify2['default'];
  skate.property = _apiProperty2['default'];
  skate.ready = _apiReady2['default'];
  skate.type = _apiType2['default'];
  skate.version = _apiVersion2['default'];
  skate.watch = _apiWatch2['default'];

  // Global
  window.skate = skate;

  // ES6
  module.exports = skate;
});