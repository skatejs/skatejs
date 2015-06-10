(function (global, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['exports', 'module', './constants', './api/create', './api/init', './api/no-conflict', './api/type', './api/version', './util/assign', './lifecycle/attached', './lifecycle/attributes', './lifecycle/created', './util/dash-case', './util/debounce', './defaults', './lifecycle/detached', './polyfill/document-observer', './polyfill/element-constructor', './polyfill/registry', './support/custom-elements', './util/walk-tree', './support/valid-custom-element'], factory);
  } else if (typeof exports !== 'undefined' && typeof module !== 'undefined') {
    factory(exports, module, require('./constants'), require('./api/create'), require('./api/init'), require('./api/no-conflict'), require('./api/type'), require('./api/version'), require('./util/assign'), require('./lifecycle/attached'), require('./lifecycle/attributes'), require('./lifecycle/created'), require('./util/dash-case'), require('./util/debounce'), require('./defaults'), require('./lifecycle/detached'), require('./polyfill/document-observer'), require('./polyfill/element-constructor'), require('./polyfill/registry'), require('./support/custom-elements'), require('./util/walk-tree'), require('./support/valid-custom-element'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, mod, global.constants, global.apiCreate, global.apiInit, global.apiNoConflict, global.apiType, global.apiVersion, global.assign, global.attached, global.attribute, global.created, global.dashCase, global.debounce, global.defaults, global.detached, global.documentObserver, global.elementConstructor, global.registry, global.supportsCustomElements, global.walkTree, global.validCustomElement);
    global.unknown = mod.exports;
  }
})(this, function (exports, module, _constants, _apiCreate, _apiInit, _apiNoConflict, _apiType, _apiVersion, _utilAssign, _lifecycleAttached, _lifecycleAttributes, _lifecycleCreated, _utilDashCase, _utilDebounce, _defaults, _lifecycleDetached, _polyfillDocumentObserver, _polyfillElementConstructor, _polyfillRegistry, _supportCustomElements, _utilWalkTree, _supportValidCustomElement) {
  'use strict';

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  var _apiCreate2 = _interopRequireDefault(_apiCreate);

  var _apiInit2 = _interopRequireDefault(_apiInit);

  var _apiNoConflict2 = _interopRequireDefault(_apiNoConflict);

  var _apiType2 = _interopRequireDefault(_apiType);

  var _apiVersion2 = _interopRequireDefault(_apiVersion);

  var _assign = _interopRequireDefault(_utilAssign);

  var _attached = _interopRequireDefault(_lifecycleAttached);

  var _attribute = _interopRequireDefault(_lifecycleAttributes);

  var _created = _interopRequireDefault(_lifecycleCreated);

  var _dashCase = _interopRequireDefault(_utilDashCase);

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
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
      initDocument();
    } else {
      document.addEventListener('DOMContentLoaded', initDocument);
    }
  }

  function dashCaseAttributeNames(options) {
    for (var _name in options.attributes) {
      var dashCasedName = (0, _dashCase['default'])(_name);

      // We only need to define a new attribute if the name is actually different.
      if (_name !== dashCasedName) {
        options.attributes[dashCasedName] = options.attributes[_name];

        // We define a non-enumerable property that links the camelCased version
        // to the dash-cased version just in case it's referred to in either form.
        // It is non-enumerable so that there are no duplicate names attributes
        // during enumeration and that the ones that are enumerable are the
        // dash-cased versions.
        Object.defineProperty(options.attributes, _name, {
          enumerable: false,
          get: function get() {
            return options.attributes[dashCasedName];
          }
        });
      }
    }
  }

  function makeOptions(userOptions) {
    var options = (0, _assign['default'])({}, _defaults2['default']);

    // Copy over all standard options if the user has defined them.
    for (var _name2 in _defaults2['default']) {
      if (userOptions[_name2] !== undefined) {
        options[_name2] = userOptions[_name2];
      }
    }

    // Copy over non-standard options.
    for (var _name3 in userOptions) {
      options[_name3] = userOptions[_name3];
    }

    dashCaseAttributeNames(options);

    return options;
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
      options.prototype = (0, _assign['default'])(Object.create(CtorParent.prototype), options.prototype);
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

    (0, _assign['default'])(Ctor, options);
    _registry['default'].set(id, Ctor);
    Object.defineProperty(Ctor.prototype, 'constructor', {
      enumerable: false,
      value: Ctor
    });

    return Ctor;
  }

  skate.create = _apiCreate2['default'];
  skate.init = _apiInit2['default'];
  skate.noConflict = _apiNoConflict2['default'];
  skate.type = _apiType2['default'];
  skate.version = _apiVersion2['default'];

  // Global
  window.skate = skate;

  // ES6
  module.exports = skate;
});