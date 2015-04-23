(function (factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "module", "./constants", "./utils/assign", "./lifecycle/attached", "./lifecycle/attribute", "./lifecycle/created", "./utils/dash-case", "./utils/debounce", "./lifecycle/detached", "./polyfill/document-observer", "./polyfill/element-constructor", "./lifecycle/init", "./polyfill/registry", "./skate/defaults", "./skate/init", "./skate/no-conflict", "./skate/type", "./skate/version", "./support/custom-elements", "./utils/walk-tree", "./support/valid-custom-element"], factory);
  } else if (typeof exports !== "undefined" && typeof module !== "undefined") {
    factory(exports, module, require("./constants"), require("./utils/assign"), require("./lifecycle/attached"), require("./lifecycle/attribute"), require("./lifecycle/created"), require("./utils/dash-case"), require("./utils/debounce"), require("./lifecycle/detached"), require("./polyfill/document-observer"), require("./polyfill/element-constructor"), require("./lifecycle/init"), require("./polyfill/registry"), require("./skate/defaults"), require("./skate/init"), require("./skate/no-conflict"), require("./skate/type"), require("./skate/version"), require("./support/custom-elements"), require("./utils/walk-tree"), require("./support/valid-custom-element"));
  }
})(function (exports, module, _constants, _utilsAssign, _lifecycleAttached, _lifecycleAttribute, _lifecycleCreated, _utilsDashCase, _utilsDebounce, _lifecycleDetached, _polyfillDocumentObserver, _polyfillElementConstructor, _lifecycleInit, _polyfillRegistry, _skateDefaults, _skateInit, _skateNoConflict, _skateType, _skateVersion, _supportCustomElements, _utilsWalkTree, _supportValidCustomElement) {
  "use strict";

  var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

  var TYPE_ELEMENT = _constants.TYPE_ELEMENT;

  var assign = _interopRequire(_utilsAssign);

  var attached = _interopRequire(_lifecycleAttached);

  var attribute = _interopRequire(_lifecycleAttribute);

  var created = _interopRequire(_lifecycleCreated);

  var dashCase = _interopRequire(_utilsDashCase);

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

  function dashCaseAttributeNames(options) {
    for (var _name in options.attributes) {
      var dashCasedName = dashCase(_name);

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
    var options = assign({}, skateDefaults);

    // Copy over all standard options if the user has defined them.
    for (var _name in skateDefaults) {
      if (userOptions[_name] !== undefined) {
        options[_name] = userOptions[_name];
      }
    }

    // Copy over non-standard options.
    for (var _name2 in userOptions) {
      options[_name2] = userOptions[_name2];
    }

    dashCaseAttributeNames(options);

    return options;
  }

  var debouncedInitDocumentWhenReady = debounce(initDocumentWhenReady);
  var HTMLElement = window.HTMLElement;

  function skate(id, userOptions) {
    var Ctor, CtorParent, isElement, isNative;
    var options = makeOptions(userOptions);

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