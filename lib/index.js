(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['module', 'exports', './api/create', './api/emit', './api/fragment', './api/init', './api/properties/index', './api/ready', './api/render', './api/version', 'object-assign', './lifecycle/attached', './lifecycle/attribute', './lifecycle/created', './defaults', './lifecycle/detached', './shared/document-observer', './shared/registry', './type/element', './util/get-all-property-descriptors', './util/get-own-property-descriptors', './util/debounce', './util/define-properties', './util/walk-tree'], factory);
  } else if (typeof exports !== "undefined") {
    factory(module, exports, require('./api/create'), require('./api/emit'), require('./api/fragment'), require('./api/init'), require('./api/properties/index'), require('./api/ready'), require('./api/render'), require('./api/version'), require('object-assign'), require('./lifecycle/attached'), require('./lifecycle/attribute'), require('./lifecycle/created'), require('./defaults'), require('./lifecycle/detached'), require('./shared/document-observer'), require('./shared/registry'), require('./type/element'), require('./util/get-all-property-descriptors'), require('./util/get-own-property-descriptors'), require('./util/debounce'), require('./util/define-properties'), require('./util/walk-tree'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod, mod.exports, global.create, global.emit, global.fragment, global.init, global.index, global.ready, global.render, global.version, global.objectAssign, global.attached, global.attribute, global.created, global.defaults, global.detached, global.documentObserver, global.registry, global.element, global.getAllPropertyDescriptors, global.getOwnPropertyDescriptors, global.debounce, global.defineProperties, global.walkTree);
    global.index = mod.exports;
  }
})(this, function (module, exports, _create, _emit, _fragment, _init, _index, _ready, _render, _version, _objectAssign, _attached, _attribute, _created, _defaults, _detached, _documentObserver, _registry, _element, _getAllPropertyDescriptors, _getOwnPropertyDescriptors, _debounce, _defineProperties, _walkTree) {
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

  var _defaults2 = _interopRequireDefault(_defaults);

  var _detached2 = _interopRequireDefault(_detached);

  var _documentObserver2 = _interopRequireDefault(_documentObserver);

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
  var initDocument = (0, _debounce2.default)(function () {
    (0, _walkTree2.default)(document.documentElement.childNodes, function (element) {
      var components = _registry2.default.find(element);

      var componentsLength = components.length;

      for (var a = 0; a < componentsLength; a++) {
        components[a].prototype.createdCallback.call(element);
      }

      for (var a = 0; a < componentsLength; a++) {
        components[a].prototype.attachedCallback.call(element);
      }
    });
  });

  function fixedProp(obj, name, value) {
    Object.defineProperty(obj, name, {
      configurable: true,
      enumerable: false,
      value: value,
      writable: false
    });
  }

  function makeCtor(name, opts) {
    var func = _create2.default.bind(null, name);

    (0, _objectAssign2.default)(func, _defaults2.default);
    (0, _defineProperties2.default)(func, (0, _getAllPropertyDescriptors2.default)(opts));
    fixedProp(func.prototype, 'constructor', func);
    fixedProp(func, 'id', name);
    fixedProp(func, 'isNative', func.type === _element2.default && document.registerElement);
    var nameProp = Object.getOwnPropertyDescriptor(func, 'name');

    if (nameProp && nameProp.configurable) {
      fixedProp(func, 'name', name);
    }

    return func;
  }

  function skate(name, opts) {
    var Ctor = makeCtor(name, opts);
    var proto = (Ctor.extends ? document.createElement(Ctor.extends).constructor : HTMLElement).prototype;

    if (!proto.isPrototypeOf(Ctor.prototype)) {
      Ctor.prototype = Object.create(proto, (0, _getOwnPropertyDescriptors2.default)(Ctor.prototype));
    }

    Ctor.prototype.createdCallback = (0, _created2.default)(Ctor);
    Ctor.prototype.attachedCallback = (0, _attached2.default)(Ctor);
    Ctor.prototype.detachedCallback = (0, _detached2.default)(Ctor);
    Ctor.prototype.attributeChangedCallback = (0, _attribute2.default)(Ctor);

    if (!Ctor.isNative) {
      initDocument();

      _documentObserver2.default.register();
    }

    var type = Ctor.type;

    if (type.register) {
      type.register(Ctor);
    }

    return _registry2.default.set(name, Ctor);
  }

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