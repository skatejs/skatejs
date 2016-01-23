import apiCreate from './api/create';
import apiEmit from './api/emit';
import apiFragment from './api/fragment';
import apiInit from './api/init';
import apiProperties from './api/properties/index';
import apiReady from './api/ready';
import apiRender from './api/render';
import apiVersion from './api/version';
import assign from 'object-assign';
import attached from './lifecycle/attached';
import attribute from './lifecycle/attribute';
import created from './lifecycle/created';
import defaults from './defaults';
import detached from './lifecycle/detached';
import documentObserver from './global/document-observer';
import registry from './global/registry';
import typeElement from './type/element';
import utilGetAllPropertyDescriptors from './util/get-all-property-descriptors';
import utilGetOwnPropertyDescriptors from './util/get-own-property-descriptors';
import utilDebounce from './util/debounce';
import utilDefineProperties from './util/define-properties';
import utilWalkTree from './util/walk-tree';

const HTMLElement = window.HTMLElement;

// A function that initialises the document once in a given event loop.
const initDocument = utilDebounce(function () {
  // For performance in older browsers, we use:
  //
  // - childNodes instead of children
  // - for instead of forEach
  utilWalkTree(document.documentElement.childNodes, function (element) {
    const components = registry.find(element);
    const componentsLength = components.length;

    // Created callbacks are called first.
    for (let a = 0; a < componentsLength; a++) {
      components[a].prototype.createdCallback.call(element);
    }

    // Attached callbacks are called separately because this emulates how
    // native works internally.
    for (let a = 0; a < componentsLength; a++) {
      components[a].prototype.attachedCallback.call(element);
    }
  });
});

// Creates a configurable, non-writable, non-enumerable property.
function fixedProp (obj, name, value) {
  const configurable = true;
  const enumerable = writable = false;
  Object.defineProperty(obj, name, { configurable, enumerable, value, writable });
}

// Makes a function / constructor that can be called as either.
function makeCtor (name, opts) {
  const func = apiCreate.bind(null, name);

  // Assigning defaults gives a predictable definition and prevents us from
  // having to do defaults checks everywhere.
  assign(func, defaults);

  // Inherit all options. This takes into account object literals as well as
  // ES2015 classes that may have inherited static props which would not be
  // considered "own".
  utilDefineProperties(func, utilGetAllPropertyDescriptors(opts));

  // Fixed info.
  fixedProp(func.prototype, 'constructor', func);
  fixedProp(func, 'id', name);
  fixedProp(func, 'isNative', func.type === typeElement && document.registerElement);

  // *sigh* WebKit
  //
  // In native, the function name is the same as the custom element name, but
  // WebKit prevents this from being defined. We do this where possible and
  // still define `id` for cross-browser compatibility.
  const nameProp = Object.getOwnPropertyDescriptor(func, 'name');
  if (nameProp && nameProp.configurable) {
    fixedProp(func, 'name', name);
  }

  return func;
}

// The main skate() function.
function skate (name, opts) {
  const Ctor = makeCtor(name, opts);
  const proto = (Ctor.extends ? document.createElement(Ctor.extends).constructor : HTMLElement).prototype;

  // If the options don't inherit a native element prototype, we ensure it does
  // because native unnecessarily requires you explicitly do this.
  if (!proto.isPrototypeOf(Ctor.prototype)) {
    Ctor.prototype = Object.create(proto, utilGetOwnPropertyDescriptors(Ctor.prototype));
  }

  // We not assign native callbacks to handle the callbacks specified in the
  // Skate definition. This allows us to abstract away any changes that may
  // occur in the spec.
  Ctor.prototype.createdCallback = created(Ctor);
  Ctor.prototype.attachedCallback = attached(Ctor);
  Ctor.prototype.detachedCallback = detached(Ctor);
  Ctor.prototype.attributeChangedCallback = attribute(Ctor);

  // In polyfill land we must emulate what the browser would normally do in
  // native.
  if (!Ctor.isNative) {
    initDocument();
    documentObserver.register();
  }

  // Call register hook. We could put this in the registry, but since the
  // registry is shared across versions, we try and churn that as little as
  // possible. It's fine here for now.
  const type = Ctor.type;
  if (type.register) {
    type.register(Ctor);
  }

  // We keep our own registry since we can't access the native one.
  return registry.set(name, Ctor);
}

// Public API.
skate.create = apiCreate;
skate.emit = apiEmit;
skate.fragment = apiFragment;
skate.init = apiInit;
skate.properties = apiProperties;
skate.ready = apiReady;
skate.render = apiRender;
skate.version = apiVersion;

export default skate;
