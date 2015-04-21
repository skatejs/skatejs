(function (factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "module", "./constants", "./utils/assign", "./lifecycle/attached", "./lifecycle/attribute", "./lifecycle/created", "./utils/debounce", "./lifecycle/detached", "./polyfill/document-observer", "./polyfill/element-constructor", "./lifecycle/init", "./polyfill/registry", "./skate/defaults", "./skate/init", "./skate/no-conflict", "./skate/type", "./skate/version", "./support/custom-elements", "./utils/walk-tree", "./support/valid-custom-element"], factory);
  } else if (typeof exports !== "undefined" && typeof module !== "undefined") {
    factory(exports, module, require("./constants"), require("./utils/assign"), require("./lifecycle/attached"), require("./lifecycle/attribute"), require("./lifecycle/created"), require("./utils/debounce"), require("./lifecycle/detached"), require("./polyfill/document-observer"), require("./polyfill/element-constructor"), require("./lifecycle/init"), require("./polyfill/registry"), require("./skate/defaults"), require("./skate/init"), require("./skate/no-conflict"), require("./skate/type"), require("./skate/version"), require("./support/custom-elements"), require("./utils/walk-tree"), require("./support/valid-custom-element"));
  }
})(function (exports, module, _constants, _utilsAssign, _lifecycleAttached, _lifecycleAttribute, _lifecycleCreated, _utilsDebounce, _lifecycleDetached, _polyfillDocumentObserver, _polyfillElementConstructor, _lifecycleInit, _polyfillRegistry, _skateDefaults, _skateInit, _skateNoConflict, _skateType, _skateVersion, _supportCustomElements, _utilsWalkTree, _supportValidCustomElement) {
  "use strict";

  var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

  var TYPE_ELEMENT = _constants.TYPE_ELEMENT;

  var assign = _interopRequire(_utilsAssign);

  var attached = _interopRequire(_lifecycleAttached);

  var attribute = _interopRequire(_lifecycleAttribute);

  var created = _interopRequire(_lifecycleCreated);

  var debounce = _interopRequire(_utilsDebounce);

  var detached = _interopRequire(_lifecycleDetached);

  var documentObserver = _interopRequire(_polyfillDocumentObserver);

  var elementConstructor = _interopRequire(_polyfillElementConstructor);

  var init = _interopRequire(_lifecycleInit);

  var registry = _interopRequire(_polyfillRegistry);

  var skateDefaults = _interopRequire(_skateDefaults);

  var skateInit = _interopRequire(_skateInit);

  var skateNoConflict = _interopRequire(_skateNoConflict);

  var skateType = _interopRequire(_skateType);

  var skateVersion = _interopRequire(_skateVersion);

  var supportsCustomElements = _interopRequire(_supportCustomElements);

  var walkTree = _interopRequire(_utilsWalkTree);

  var validCustomElement = _interopRequire(_supportValidCustomElement);

  function initDocument() {
    walkTree(document.documentElement.childNodes, init);
  }

  function initDocumentWhenReady() {
    if (document.readyState === "complete" || document.readyState === "interactive") {
      initDocument();
    } else {
      document.addEventListener("DOMContentLoaded", initDocument);
    }
  }

  function readonly(value) {
    return {
      configurable: false,
      value: value,
      writable: false
    };
  }

  var debouncedInitDocumentWhenReady = debounce(initDocumentWhenReady);
  var HTMLElement = window.HTMLElement;

  function skate(id, userOptions) {
    var Ctor, CtorParent, isElement, isNative;
    var options = assign({}, skateDefaults);

    // The assign() func only copies own properties. If a constructor is extended
    // and passed as the userOptions then properties that aren't on a Function
    // instance by default won't get copied. This ensures that all available
    // options are passed along if they were passed as part of the userOptions.
    Object.keys(skateDefaults).forEach(function (name) {
      if (userOptions[name] !== undefined) {
        options[name] = userOptions[name];
      }
    });

    CtorParent = options["extends"] ? document.createElement(options["extends"]).constructor : HTMLElement;
    isElement = options.type === TYPE_ELEMENT;
    isNative = isElement && supportsCustomElements() && validCustomElement(id);

    // Extend behaviour of existing callbacks.
    options.prototype.createdCallback = created(options);
    options.prototype.attachedCallback = attached(options);
    options.prototype.detachedCallback = detached(options);
    options.prototype.attributeChangedCallback = attribute(options);
    Object.defineProperties(options, {
      id: readonly(id),
      isElement: readonly(isElement),
      isNative: readonly(isNative)
    });

    // By always setting in the registry we ensure that behaviour between
    // polyfilled and native registries are handled consistently.
    registry.set(id, options);

    if (!CtorParent.prototype.isPrototypeOf(options.prototype)) {
      options.prototype = assign(Object.create(CtorParent.prototype), options.prototype);
    }

    if (isNative) {
      Ctor = document.registerElement(id, options);
    } else {
      debouncedInitDocumentWhenReady();
      documentObserver.register();

      if (isElement) {
        Ctor = elementConstructor(id, options);
      }
    }

    if (Ctor) {
      return assign(Ctor, options);
    }
  }

  skate.defaults = skateDefaults;
  skate.init = skateInit;
  skate.noConflict = skateNoConflict;
  skate.type = skateType;
  skate.version = skateVersion;

  // Global
  window.skate = skate;

  // ES6
  module.exports = skate;
});