(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['module', 'exports', 'object-assign', '../lifecycle/attached', '../lifecycle/attribute', './create', '../lifecycle/created', '../native/create-element', '../native/custom-elements', '../data', '../defaults', '../lifecycle/detached', '../native/document-observer', '../lifecycle/render', '../native/support', '../util/get-all-property-descriptors', '../util/get-own-property-descriptors', '../util/debounce', '../util/define-properties', '../util/walk-tree'], factory);
  } else if (typeof exports !== "undefined") {
    factory(module, exports, require('object-assign'), require('../lifecycle/attached'), require('../lifecycle/attribute'), require('./create'), require('../lifecycle/created'), require('../native/create-element'), require('../native/custom-elements'), require('../data'), require('../defaults'), require('../lifecycle/detached'), require('../native/document-observer'), require('../lifecycle/render'), require('../native/support'), require('../util/get-all-property-descriptors'), require('../util/get-own-property-descriptors'), require('../util/debounce'), require('../util/define-properties'), require('../util/walk-tree'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod, mod.exports, global.objectAssign, global.attached, global.attribute, global.create, global.created, global.createElement, global.customElements, global.data, global.defaults, global.detached, global.documentObserver, global.render, global.support, global.getAllPropertyDescriptors, global.getOwnPropertyDescriptors, global.debounce, global.defineProperties, global.walkTree);
    global.skate = mod.exports;
  }
})(this, function (module, exports, _objectAssign, _attached, _attribute, _create, _created, _createElement, _customElements, _data, _defaults, _detached, _documentObserver, _render, _support, _getAllPropertyDescriptors, _getOwnPropertyDescriptors, _debounce, _defineProperties, _walkTree) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  exports.default = function (name, opts) {
    // Ensure the render function render's using Incremental DOM.
    opts.render = (0, _render2.default)(opts);

    var Ctor = createConstructor(name, opts);
    addConstructorInformation(name, Ctor);
    ensureIncrementalDomKnowsToSetPropsForLinkedAtrs(name, opts);

    // If the options don't inherit a native element prototype, we ensure it does
    // because native requires you explicitly do this. Here we solve the common
    // use case by defaulting to HTMLElement.prototype.
    if (!HTMLElement.prototype.isPrototypeOf(Ctor.prototype) && !SVGElement.prototype.isPrototypeOf(Ctor.prototype)) {
      var proto = (Ctor.extends ? (0, _createElement2.default)(Ctor.extends).constructor : HTMLElement).prototype;
      Ctor.prototype = Object.create(proto, (0, _getOwnPropertyDescriptors2.default)(Ctor.prototype));
    }

    // We assign native callbacks to handle the callbacks specified in the
    // Skate definition. This allows us to abstract away any changes that may
    // occur in the spec.
    (0, _objectAssign2.default)(Ctor.prototype, {
      createdCallback: (0, _created2.default)(Ctor),
      attachedCallback: (0, _attached2.default)(Ctor),
      detachedCallback: (0, _detached2.default)(Ctor),
      attributeChangedCallback: (0, _attribute2.default)(Ctor)
    });

    // In polyfill land we must emulate what the browser would normally do in
    // native.
    if (_support2.default.polyfilled) {
      initDocument();
      _documentObserver2.default.register();
    }

    _customElements2.default.define(name, Ctor);
    return _customElements2.default.get(name);
  };

  var _objectAssign2 = _interopRequireDefault(_objectAssign);

  var _attached2 = _interopRequireDefault(_attached);

  var _attribute2 = _interopRequireDefault(_attribute);

  var _create2 = _interopRequireDefault(_create);

  var _created2 = _interopRequireDefault(_created);

  var _createElement2 = _interopRequireDefault(_createElement);

  var _customElements2 = _interopRequireDefault(_customElements);

  var _data2 = _interopRequireDefault(_data);

  var _defaults2 = _interopRequireDefault(_defaults);

  var _detached2 = _interopRequireDefault(_detached);

  var _documentObserver2 = _interopRequireDefault(_documentObserver);

  var _render2 = _interopRequireDefault(_render);

  var _support2 = _interopRequireDefault(_support);

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
      var component = _customElements2.default.get(element.tagName.toLowerCase());

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

  function fixedProp(obj, name, value) {
    Object.defineProperty(obj, name, {
      configurable: true,
      enumerable: false,
      value: value,
      writable: false
    });
  }

  function createConstructor(name, opts) {
    var func = _create2.default.bind(null, name);

    (0, _objectAssign2.default)(func, _defaults2.default);
    (0, _defineProperties2.default)(func, (0, _getAllPropertyDescriptors2.default)(opts));
    return func;
  }

  function addConstructorInformation(name, Ctor) {
    fixedProp(Ctor.prototype, 'constructor', Ctor);
    fixedProp(Ctor, 'id', name);
    var nameProp = Object.getOwnPropertyDescriptor(Ctor, 'name');

    if (nameProp && nameProp.configurable) {
      fixedProp(Ctor, 'name', name);
    }
  }

  function ensureIncrementalDomKnowsToSetPropsForLinkedAtrs(name, opts) {
    Object.keys(opts).forEach(function (optKey) {
      var propKey = name + '.' + optKey;
      _data2.default.applyProp[propKey] = true;
    });
  }

  module.exports = exports['default'];
});