(function (global, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['exports', 'module', './api/create', './api/emit', './api/fragment', './api/init', './api/properties/index', './api/ready', './api/render/index', './api/version', 'object-assign', './util/assign-safe', './lifecycle/attached', './lifecycle/attribute', './lifecycle/created', './util/debounce', './defaults', './lifecycle/detached', './global/document-observer', './global/registry', './support/custom-elements', './type/element', './util/walk-tree', './support/valid-custom-element'], factory);
  } else if (typeof exports !== 'undefined' && typeof module !== 'undefined') {
    factory(exports, module, require('./api/create'), require('./api/emit'), require('./api/fragment'), require('./api/init'), require('./api/properties/index'), require('./api/ready'), require('./api/render/index'), require('./api/version'), require('object-assign'), require('./util/assign-safe'), require('./lifecycle/attached'), require('./lifecycle/attribute'), require('./lifecycle/created'), require('./util/debounce'), require('./defaults'), require('./lifecycle/detached'), require('./global/document-observer'), require('./global/registry'), require('./support/custom-elements'), require('./type/element'), require('./util/walk-tree'), require('./support/valid-custom-element'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, mod, global.apiCreate, global.apiEmit, global.apiFragment, global.apiInit, global.apiProperties, global.apiReady, global.apiRender, global.apiVersion, global.assign, global.assignSafe, global.attached, global.attribute, global.created, global.debounce, global.defaults, global.detached, global.documentObserver, global.registry, global.supportsCustomElements, global.typeElement, global.utilWalkTree, global.validCustomElement);
    global.index = mod.exports;
  }
})(this, function (exports, module, _apiCreate, _apiEmit, _apiFragment, _apiInit, _apiPropertiesIndex, _apiReady, _apiRenderIndex, _apiVersion, _objectAssign, _utilAssignSafe, _lifecycleAttached, _lifecycleAttribute, _lifecycleCreated, _utilDebounce, _defaults, _lifecycleDetached, _globalDocumentObserver, _globalRegistry, _supportCustomElements, _typeElement, _utilWalkTree, _supportValidCustomElement) {
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

  var _assignSafe = _interopRequireDefault(_utilAssignSafe);

  var _attached = _interopRequireDefault(_lifecycleAttached);

  var _attribute = _interopRequireDefault(_lifecycleAttribute);

  var _created = _interopRequireDefault(_lifecycleCreated);

  var _debounce = _interopRequireDefault(_utilDebounce);

  var _defaults2 = _interopRequireDefault(_defaults);

  var _detached = _interopRequireDefault(_lifecycleDetached);

  var _documentObserver = _interopRequireDefault(_globalDocumentObserver);

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

  function makeNonNewableWrapper(Ctor, opts) {
    function CtorWrapper() {
      var properties = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

      return (0, _assign['default'])(new Ctor(), properties);
    }

    // Copy prototype.
    CtorWrapper.prototype = Ctor.prototype;

    // Ensure a non-enumerable constructor property exists.
    Object.defineProperty(CtorWrapper.prototype, 'constructor', {
      configurable: true,
      enumerable: false,
      value: CtorWrapper,
      writable: false
    });

    // Make Function.prototype.name behave like native custom elements but only
    // if it's allowed (i.e. not Safari).
    var nameProp = Object.getOwnPropertyDescriptor(CtorWrapper, 'name');
    if (nameProp && nameProp.configurable) {
      Object.defineProperty(CtorWrapper, 'name', {
        configurable: true,
        enumerable: false,
        value: opts.id,
        writable: false
      });
    }

    return CtorWrapper;
  }

  function polyfillElementConstructor(opts) {
    var type = opts.type;
    function CustomElement() {
      var element = type.create(opts);
      opts.prototype.createdCallback.call(element);
      return element;
    }
    CustomElement.prototype = opts.prototype;
    return CustomElement;
  }

  var HTMLElement = window.HTMLElement;
  var initDocument = (0, _debounce['default'])(function () {
    (0, _utilWalkTree2['default'])(document.documentElement.childNodes, function (element) {
      var components = _registry['default'].find(element);
      var componentsLength = components.length;

      for (var a = 0; a < componentsLength; a++) {
        components[a].prototype.createdCallback.call(element);
      }

      for (var a = 0; a < componentsLength; a++) {
        components[a].prototype.attachedCallback.call(element);
      }
    });
  });

  function skate(name, userOptions) {
    var Ctor = undefined,
        parentProto = undefined;
    var opts = makeOptions(userOptions);

    opts.id = name;
    opts.isNative = opts.type === _typeElement2['default'] && (0, _supportsCustomElements['default'])() && (0, _validCustomElement['default'])(name);
    parentProto = (opts['extends'] ? document.createElement(opts['extends']).constructor : HTMLElement).prototype;

    // Inherit from parent prototype.
    if (!parentProto.isPrototypeOf(opts.prototype)) {
      opts.prototype = (0, _assignSafe['default'])(Object.create(parentProto), opts.prototype);
    }

    // Make custom definition conform to native.
    opts.prototype.createdCallback = (0, _created['default'])(opts);
    opts.prototype.attachedCallback = (0, _attached['default'])(opts);
    opts.prototype.detachedCallback = (0, _detached['default'])(opts);
    opts.prototype.attributeChangedCallback = (0, _attribute['default'])(opts);

    // Make a constructor for the definition.
    if (opts.isNative) {
      var nativeDefinition = {
        prototype: opts.prototype
      };
      if (opts['extends']) {
        nativeDefinition['extends'] = opts['extends'];
      }
      Ctor = document.registerElement(name, nativeDefinition);
    } else {
      Ctor = polyfillElementConstructor(opts);
      initDocument();
      _documentObserver['default'].register();
    }

    Ctor = makeNonNewableWrapper(Ctor, opts);
    (0, _assignSafe['default'])(Ctor, opts);
    _registry['default'].set(name, Ctor);

    return Ctor;
  }

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