import { TYPE_ELEMENT } from './constants';
import assign from './utils/assign';
import attached from './lifecycle/attached';
import attribute from './lifecycle/attribute';
import created from './lifecycle/created';
import debounce from './utils/debounce';
import detached from './lifecycle/detached';
import documentObserver from './polyfill/document-observer';
import elementConstructor from './polyfill/element-constructor';
import init from './lifecycle/init';
import registry from './polyfill/registry';
import skateDefaults from './skate/defaults';
import skateInit from './skate/init';
import skateNoConflict from './skate/no-conflict';
import skateType from './skate/type';
import skateVersion from './skate/version';
import supportsCustomElements from './support/custom-elements';
import walkTree from './utils/walk-tree';
import validCustomElement from './support/valid-custom-element';

function initDocument () {
  walkTree(document.documentElement.childNodes, init);
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

var debouncedInitDocumentWhenReady = debounce(initDocumentWhenReady);
var HTMLElement = window.HTMLElement;

function skate (id, userOptions) {
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

  // By always setting in the registry we ensure that behaviour between
  // polyfilled and native registries are handled consistently.
  registry.set(id, options);

  if (!CtorParent.isPrototypeOf(options.prototype)) {
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
export default skate;
