import { TYPE_ELEMENT } from './constants';
import attached from './lifecycle/attached';
import attribute from './lifecycle/attribute';
import created from './lifecycle/created';
import debounce from './utils/debounce';
import detached from './lifecycle/detached';
import documentObserver from './polyfill/document-observer';
import elementConstructor from './polyfill/element-constructor';
import inherit from './utils/inherit';
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

var debouncedInitDocumentWhenReady = debounce(initDocumentWhenReady);
var HTMLElement = window.HTMLElement;
var HTMLElementPrototype = HTMLElement.prototype;

function skate (id, options) {
  // Copy options and set defaults.
  options = inherit(inherit({ id: id }, options), skateDefaults);

  var Ctor;
  var parent = options.extends ? document.createElement(options.extends).constructor.prototype : HTMLElementPrototype;

  // Extend behaviour of existing callbacks.
  options.prototype.createdCallback = created;
  options.prototype.attachedCallback = attached;
  options.prototype.detachedCallback = detached;
  options.prototype.attributeChangedCallback = attribute(options);
  options.isElement = options.type === TYPE_ELEMENT;
  options.isNative = supportsCustomElements() && validCustomElement(id) && options.isElement;

  // By always setting in the registry we ensure that behaviour between
  // polyfilled and native registries are handled consistently.
  registry.set(id, options);

  if (!parent.isPrototypeOf(options.prototype)) {
    options.prototype = inherit(Object.create(parent), options.prototype, true);
  }

  if (options.isNative) {
    Ctor = document.registerElement(id, options);
  } else {
    debouncedInitDocumentWhenReady();
    documentObserver.register({
      fixIe: !!options.prototype.detachedCallback
    });

    if (options.isElement) {
      Ctor = elementConstructor(id, options);
    }
  }

  if (Ctor) {
    inherit(Ctor, options);
  }

  return Ctor;
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
