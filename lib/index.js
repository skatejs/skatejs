(function (global, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['exports', 'module', './api/create', './api/emit', './api/fragment', './api/init', './api/version', './util/assign', './util/assign-safe', './lifecycle/attached', './lifecycle/attribute', './lifecycle/created', './util/debounce', './defaults', './lifecycle/detached', './global/document-observer', './util/element-constructor', './global/registry', './support/custom-elements', './type/element', './util/walk-tree', './support/valid-custom-element'], factory);
  } else if (typeof exports !== 'undefined' && typeof module !== 'undefined') {
    factory(exports, module, require('./api/create'), require('./api/emit'), require('./api/fragment'), require('./api/init'), require('./api/version'), require('./util/assign'), require('./util/assign-safe'), require('./lifecycle/attached'), require('./lifecycle/attribute'), require('./lifecycle/created'), require('./util/debounce'), require('./defaults'), require('./lifecycle/detached'), require('./global/document-observer'), require('./util/element-constructor'), require('./global/registry'), require('./support/custom-elements'), require('./type/element'), require('./util/walk-tree'), require('./support/valid-custom-element'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, mod, global.apiCreate, global.apiEmit, global.apiFragment, global.apiInit, global.apiVersion, global.assign, global.assignSafe, global.attached, global.attribute, global.created, global.debounce, global.defaults, global.detached, global.documentObserver, global.elementConstructor, global.registry, global.supportsCustomElements, global.typeElement, global.utilWalkTree, global.validCustomElement);
    global.unknown = mod.exports;
  }
})(this, function (exports, module, _apiCreate, _apiEmit, _apiFragment, _apiInit, _apiVersion, _utilAssign, _utilAssignSafe, _lifecycleAttached, _lifecycleAttribute, _lifecycleCreated, _utilDebounce, _defaults, _lifecycleDetached, _globalDocumentObserver, _utilElementConstructor, _globalRegistry, _supportCustomElements, _typeElement, _utilWalkTree, _supportValidCustomElement) {
  'use strict';

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  var _apiCreate2 = _interopRequireDefault(_apiCreate);

  var _apiEmit2 = _interopRequireDefault(_apiEmit);

  var _apiFragment2 = _interopRequireDefault(_apiFragment);

  var _apiInit2 = _interopRequireDefault(_apiInit);

  var _apiVersion2 = _interopRequireDefault(_apiVersion);

  var _assign = _interopRequireDefault(_utilAssign);

  var _assignSafe = _interopRequireDefault(_utilAssignSafe);

  var _attached = _interopRequireDefault(_lifecycleAttached);

  var _attribute = _interopRequireDefault(_lifecycleAttribute);

  var _created = _interopRequireDefault(_lifecycleCreated);

  var _debounce = _interopRequireDefault(_utilDebounce);

  var _defaults2 = _interopRequireDefault(_defaults);

  var _detached = _interopRequireDefault(_lifecycleDetached);

  var _documentObserver = _interopRequireDefault(_globalDocumentObserver);

  var _elementConstructor = _interopRequireDefault(_utilElementConstructor);

  var _registry = _interopRequireDefault(_globalRegistry);

  var _supportsCustomElements = _interopRequireDefault(_supportCustomElements);

  var _typeElement2 = _interopRequireDefault(_typeElement);

  var _utilWalkTree2 = _interopRequireDefault(_utilWalkTree);

  var _validCustomElement = _interopRequireDefault(_supportValidCustomElement);

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
      var props = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

      return (0, _assign['default'])(new Ctor(), props);
    };
    CtorWrapper.prototype = Ctor.prototype;
    return CtorWrapper;
  }

  var HTMLElement = window.HTMLElement;
  var initDocument = (0, _debounce['default'])(function () {
    (0, _utilWalkTree2['default'])(document.documentElement.childNodes, function (element) {
      var components = _registry['default'].find(element);
      var componentsLength = components.length;

      for (var a = 0; a < componentsLength; a++) {
        (0, _created['default'])(components[a]).call(element);
      }

      for (var a = 0; a < componentsLength; a++) {
        (0, _attached['default'])(components[a]).call(element);
      }
    });
  });

  function skate(id, userOptions) {
    var Ctor, CtorParent, isNative;
    var opts = makeOptions(userOptions);

    CtorParent = opts['extends'] ? document.createElement(opts['extends']).constructor : HTMLElement;
    isNative = opts.type === _typeElement2['default'] && (0, _supportsCustomElements['default'])() && (0, _validCustomElement['default'])(id);

    // Inherit from parent prototype.
    if (!CtorParent.prototype.isPrototypeOf(opts.prototype)) {
      opts.prototype = (0, _assignSafe['default'])(Object.create(CtorParent.prototype), opts.prototype);
    }

    // Native doesn't like if you pass a falsy value. Must be undefined.
    opts['extends'] = opts['extends'] || undefined;

    // Extend behaviour of existing callbacks.
    opts.prototype.createdCallback = (0, _created['default'])(opts);
    opts.prototype.attachedCallback = (0, _attached['default'])(opts);
    opts.prototype.detachedCallback = (0, _detached['default'])(opts);
    opts.prototype.attributeChangedCallback = (0, _attribute['default'])(opts);

    // Ensure the ID can be retrieved from the options or constructor.
    opts.id = id;

    // Make a constructor for the definition.
    if (isNative) {
      Ctor = document.registerElement(id, opts);
    } else {
      Ctor = (0, _elementConstructor['default'])(opts);
      initDocument();
      _documentObserver['default'].register();
    }

    Ctor = makeNonNewableWrapper(Ctor);
    (0, _assignSafe['default'])(Ctor, opts);
    _registry['default'].set(id, Ctor);

    return Ctor;
  }

  skate.create = _apiCreate2['default'];
  skate.emit = _apiEmit2['default'];
  skate.fragment = _apiFragment2['default'];
  skate.init = _apiInit2['default'];
  skate.version = _apiVersion2['default'];

  // ES6
  module.exports = skate;
});