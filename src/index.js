import { TYPE_ELEMENT } from './constants';
import assign from './utils/assign';
import attached from './lifecycle/attached';
import attribute from './lifecycle/attribute';
import created from './lifecycle/created';
import createElement from './polyfill/create-element';
import dashCase from './utils/dash-case';
import debounce from './utils/debounce';
import detached from './lifecycle/detached';
import documentObserver from './polyfill/document-observer';
import elementConstructor from './polyfill/element-constructor';
import registry from './polyfill/registry';
import skateDefaults from './api/defaults';
import skateInit from './api/init';
import skateNoConflict from './api/no-conflict';
import skateType from './api/type';
import skateVersion from './api/version';
import supportsCustomElements from './support/custom-elements';
import walkTree from './utils/walk-tree';
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
  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    initDocument();
  } else {
    document.addEventListener('DOMContentLoaded', initDocument);
  }
}

function readonly (value) {
  return {
    configurable: false,
    value: value,
    writable: false
  };
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
  var options = assign({}, skateDefaults);

  // Copy over all standard options if the user has defined them.
  for (let name in skateDefaults) {
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

  if (!CtorParent.prototype.isPrototypeOf(options.prototype)) {
    options.prototype = assign(Object.create(CtorParent.prototype), options.prototype);
  }

  if (isNative) {
    Ctor = document.registerElement(id, options);
  } else {
    Ctor = elementConstructor(options);
    debouncedInitDocumentWhenReady();
    documentObserver.register();
  }

  registry.set(id, Ctor);
  return assign(Ctor, options);
}

skate.defaults = skateDefaults;
skate.init = skateInit;
skate.noConflict = skateNoConflict;
skate.type = skateType;
skate.version = skateVersion;

// Global
window.skate = skate;

// ES6
export default skate;
