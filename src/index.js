import apiCreate from './api/create';
import apiEmit from './api/emit';
import apiFragment from './api/fragment';
import apiInit from './api/init';
import apiProperties from './api/properties/index';
import apiReady from './api/ready';
import apiRender from './api/render/index';
import apiVersion from './api/version';
import assign from 'object-assign';
import assignSafe from './util/assign-safe';
import attached from './lifecycle/attached';
import attribute from './lifecycle/attribute';
import created from './lifecycle/created';
import debounce from './util/debounce';
import defaults from './defaults';
import detached from './lifecycle/detached';
import documentObserver from './global/document-observer';
import registry from './global/registry';
import supportsCustomElements from './support/custom-elements';
import typeElement from './type/element';
import utilWalkTree from './util/walk-tree';
import validCustomElement from './support/valid-custom-element';

const HTMLElement = window.HTMLElement;

// A function that initialises the document once in a given event loop.
const initDocument = debounce(function () {
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
  const func = assign(apiCreate.bind(null, name), defaults);

  // We need to copy all props, not just own props.
  for (let prop in opts) func[prop] = opts[prop];

  // Fixed info.
  fixedProp(func.prototype, 'constructor', func);
  fixedProp(func, 'id', name);
  fixedProp(func, 'isNative', func.type === typeElement && supportsCustomElements() && validCustomElement(name));

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

  // If the options don't inherit a native element prototype, we do it for them.
  if (!proto.isPrototypeOf(Ctor.prototype)) {
    Ctor.prototype = assignSafe(Object.create(proto), Ctor.prototype);
  }

  // Make custom definition conform to native.
  Ctor.prototype.createdCallback = created(Ctor);
  Ctor.prototype.attachedCallback = attached(Ctor);
  Ctor.prototype.detachedCallback = detached(Ctor);
  Ctor.prototype.attributeChangedCallback = attribute(Ctor);

  // Native or polyfill.
  if (Ctor.isNative) {
    const nativeDefinition = { prototype: Ctor.prototype };
    Ctor.extends && (nativeDefinition.extends = Ctor.extends);
    document.registerElement(name, nativeDefinition);
  } else {
    initDocument();
    documentObserver.register();
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
