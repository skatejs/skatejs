(function (factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "module", "./api/chain", "./api/create", "./api/emit", "./api/event", "./api/init", "./api/no-conflict", "./api/notify", "./api/property", "./api/ready", "./api/template", "./api/type", "./api/version", "./api/watch", "./util/assign", "./util/assign-safe", "./lifecycle/attached", "./lifecycle/attribute", "./lifecycle/created", "./util/debounce", "./defaults", "./lifecycle/detached", "./global/document-observer", "./util/element-constructor", "./global/registry", "./support/custom-elements", "./util/walk-tree", "./support/valid-custom-element"], factory);
  } else if (typeof exports !== "undefined" && typeof module !== "undefined") {
    factory(exports, module, require("./api/chain"), require("./api/create"), require("./api/emit"), require("./api/event"), require("./api/init"), require("./api/no-conflict"), require("./api/notify"), require("./api/property"), require("./api/ready"), require("./api/template"), require("./api/type"), require("./api/version"), require("./api/watch"), require("./util/assign"), require("./util/assign-safe"), require("./lifecycle/attached"), require("./lifecycle/attribute"), require("./lifecycle/created"), require("./util/debounce"), require("./defaults"), require("./lifecycle/detached"), require("./global/document-observer"), require("./util/element-constructor"), require("./global/registry"), require("./support/custom-elements"), require("./util/walk-tree"), require("./support/valid-custom-element"));
  }
})(function (exports, module, _apiChain, _apiCreate, _apiEmit, _apiEvent, _apiInit, _apiNoConflict, _apiNotify, _apiProperty, _apiReady, _apiTemplate, _apiType, _apiVersion, _apiWatch, _utilAssign, _utilAssignSafe, _lifecycleAttached, _lifecycleAttribute, _lifecycleCreated, _utilDebounce, _defaults, _lifecycleDetached, _globalDocumentObserver, _utilElementConstructor, _globalRegistry, _supportCustomElements, _utilWalkTree, _supportValidCustomElement) {
  "use strict";

  var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

  var apiChain = _interopRequire(_apiChain);

  var apiCreate = _interopRequire(_apiCreate);

  var apiEmit = _interopRequire(_apiEmit);

  var apiEvent = _interopRequire(_apiEvent);

  var apiInit = _interopRequire(_apiInit);

  var apiNoConflict = _interopRequire(_apiNoConflict);

  var apiNotify = _interopRequire(_apiNotify);

  var apiProperty = _interopRequire(_apiProperty);

  var apiReady = _interopRequire(_apiReady);

  var apiTemplate = _interopRequire(_apiTemplate);

  var apiType = _interopRequire(_apiType);

  var apiVersion = _interopRequire(_apiVersion);

  var apiWatch = _interopRequire(_apiWatch);

  var assign = _interopRequire(_utilAssign);

  var assignSafe = _interopRequire(_utilAssignSafe);

  var attached = _interopRequire(_lifecycleAttached);

  var attribute = _interopRequire(_lifecycleAttribute);

  var created = _interopRequire(_lifecycleCreated);

  var debounce = _interopRequire(_utilDebounce);

  var defaults = _interopRequire(_defaults);

  var detached = _interopRequire(_lifecycleDetached);

  var documentObserver = _interopRequire(_globalDocumentObserver);

  var elementConstructor = _interopRequire(_utilElementConstructor);

  var registry = _interopRequire(_globalRegistry);

  var supportsCustomElements = _interopRequire(_supportCustomElements);

  var walkTree = _interopRequire(_utilWalkTree);

  var validCustomElement = _interopRequire(_supportValidCustomElement);

  function initDocument() {
    walkTree(document.documentElement.childNodes, function (element) {
      var components = registry.find(element);
      var componentsLength = components.length;

      for (var a = 0; a < componentsLength; a++) {
        created(components[a]).call(element);
      }

      for (var a = 0; a < componentsLength; a++) {
        attached(components[a]).call(element);
      }
    });
  }

  function initDocumentWhenReady() {
    apiReady(initDocument);
  }

  function makeOptions(userOptions) {
    var options = assignSafe({}, defaults);

    // Copy over all standard options if the user has defined them.
    for (var _name in defaults) {
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

      return assign(new Ctor(), props);
    };
    CtorWrapper.prototype = Ctor.prototype;
    return CtorWrapper;
  }

  var debouncedInitDocumentWhenReady = debounce(initDocumentWhenReady);
  var HTMLElement = window.HTMLElement;

  function skate(id, userOptions) {
    var Ctor, CtorParent, isNative;
    var opts = makeOptions(userOptions);

    CtorParent = opts["extends"] ? document.createElement(opts["extends"]).constructor : HTMLElement;
    isNative = opts.type === "element" && supportsCustomElements() && validCustomElement(id);

    // Inherit from parent prototype.
    if (!CtorParent.prototype.isPrototypeOf(opts.prototype)) {
      opts.prototype = assignSafe(Object.create(CtorParent.prototype), opts.prototype);
    }

    // Extend behaviour of existing callbacks.
    opts.prototype.createdCallback = created(opts);
    opts.prototype.attachedCallback = attached(opts);
    opts.prototype.detachedCallback = detached(opts);
    opts.prototype.attributeChangedCallback = attribute(opts);

    // Ensure the ID can be retrieved from the options or constructor.
    opts.id = id;

    // Make a constructor for the definition.
    if (isNative) {
      Ctor = document.registerElement(id, opts);
    } else {
      Ctor = elementConstructor(opts);
      debouncedInitDocumentWhenReady();
      documentObserver.register();
    }

    Ctor = makeNonNewableWrapper(Ctor);
    assignSafe(Ctor, opts);
    registry.set(id, Ctor);

    return Ctor;
  }

  skate.chain = apiChain;
  skate.create = apiCreate;
  skate.emit = apiEmit;
  skate.event = apiEvent;
  skate.init = apiInit;
  skate.noConflict = apiNoConflict;
  skate.notify = apiNotify;
  skate.property = apiProperty;
  skate.ready = apiReady;
  skate.template = apiTemplate;
  skate.type = apiType;
  skate.version = apiVersion;
  skate.watch = apiWatch;

  // Global
  window.skate = skate;

  // ES6
  module.exports = skate;
});