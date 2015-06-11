import { TYPE_ELEMENT } from './constants';
import apiCreate from './api/create';
import apiInit from './api/init';
import apiNoConflict from './api/no-conflict';
import apiNotify from './api/notify';
import apiReady from './api/ready';
import apiType from './api/type';
import apiVersion from './api/version';
import apiWatch from './api/watch';
import assign from './util/assign';
import attached from './lifecycle/attached';
import attribute from './lifecycle/attributes';
import created from './lifecycle/created';
import dashCase from './util/dash-case';
import debounce from './util/debounce';
import defaults from './defaults';
import detached from './lifecycle/detached';
import documentObserver from './polyfill/document-observer';
import elementConstructor from './polyfill/element-constructor';
import registry from './polyfill/registry';
import supportsCustomElements from './support/custom-elements';
import walkTree from './util/walk-tree';
import validCustomElement from './support/valid-custom-element';

function initDocument () {
  walkTree(document.documentElement.childNodes, function (element) {
    var components = registry.getForElement(element);
    var componentsLength = components.length;

    for (let a = 0; a < componentsLength; a++) {
      created(components[a]).call(element);
    }

    for (let a = 0; a < componentsLength; a++) {
      attached(components[a]).call(element);
    }
  });
}

function initDocumentWhenReady () {
  apiReady(initDocument);
}

function dashCaseAttributeNames (options) {
  for (let name in options.attributes) {
    var dashCasedName = dashCase(name);

    // We only need to define a new attribute if the name is actually different.
    if (name !== dashCasedName) {
      options.attributes[dashCasedName] = options.attributes[name];

      // We define a non-enumerable property that links the camelCased version
      // to the dash-cased version just in case it's referred to in either form.
      // It is non-enumerable so that there are no duplicate names attributes
      // during enumeration and that the ones that are enumerable are the
      // dash-cased versions.
      Object.defineProperty(options.attributes, name, {
        enumerable: false,
        get: function () {
          return options.attributes[dashCasedName];
        }
      });
    }
  }
}

function makeOptions (userOptions) {
  var options = assign({}, defaults);

  // Copy over all standard options if the user has defined them.
  for (let name in defaults) {
    if (userOptions[name] !== undefined) {
      options[name] = userOptions[name];
    }
  }

  // Copy over non-standard options.
  for (let name in userOptions) {
    options[name] = userOptions[name];
  }

  dashCaseAttributeNames(options);

  return options;
}

var debouncedInitDocumentWhenReady = debounce(initDocumentWhenReady);
var HTMLElement = window.HTMLElement;

function skate (id, userOptions) {
  var Ctor, CtorParent, isElement, isNative;
  var options = makeOptions(userOptions);

  CtorParent = options.extends ? document.createElement(options.extends).constructor : HTMLElement;
  isElement = options.type === TYPE_ELEMENT;
  isNative = isElement && supportsCustomElements() && validCustomElement(id);

  // Inherit from parent prototype.
  if (!CtorParent.prototype.isPrototypeOf(options.prototype)) {
    options.prototype = assign(Object.create(CtorParent.prototype), options.prototype);
  }

  // Extend behaviour of existing callbacks.
  options.prototype.createdCallback = created(options);
  options.prototype.attachedCallback = attached(options);
  options.prototype.detachedCallback = detached(options);
  options.prototype.attributeChangedCallback = attribute(options);
  Object.defineProperty(options, 'id', {
    configurable: false,
    value: id,
    writable: false
  });

  // Make a constructor for the definition.
  if (isNative) {
    Ctor = document.registerElement(id, options);
  } else {
    Ctor = elementConstructor(options);
    debouncedInitDocumentWhenReady();
    documentObserver.register();
  }

  assign(Ctor, options);
  registry.set(id, Ctor);
  Object.defineProperty(Ctor.prototype, 'constructor', {
    enumerable: false,
    value: Ctor
  });

  return Ctor;
}

skate.create = apiCreate;
skate.init = apiInit;
skate.noConflict = apiNoConflict;
skate.notify = apiNotify;
skate.ready = apiReady;
skate.type = apiType;
skate.version = apiVersion;
skate.watch = apiWatch;

// Global
window.skate = skate;

// ES6
export default skate;
