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

    for (let a = 0; a < componentsLength; a++) {
      components[a].prototype.createdCallback.call(element);
    }

    for (let a = 0; a < componentsLength; a++) {
      components[a].prototype.attachedCallback.call(element);
    }
  });
});

function fixedProp (obj, name, value) {
  const configurable = true;
  const enumerable = writable = false;
  Object.defineProperty(obj, name, { configurable, enumerable, value, writable });
}

function makeCtor (name, opts) {
  const func = assign(apiCreate.bind(null, name), defaults);

  for (let prop in opts) func[prop] = opts[prop];
  fixedProp(func.prototype, 'constructor', func);
  fixedProp(func, 'id', name);
  fixedProp(func, 'isNative', func.type === typeElement && supportsCustomElements() && validCustomElement(name));

  // To support the passing of a function instead of an object.
  //
  // https://github.com/w3c/webcomponents/wiki/Custom-Elements:-Contentious-Bits#constructor-vs-createdcallback
  if (typeof opts === 'function') {
    //func.created = opts;
  }

  // *sigh* WebKit
  //
  // We'd like to be able to define the function name as the same value as the
  // component id but WebKit has made this a non-configurable property.
  const nameProp = Object.getOwnPropertyDescriptor(func, 'name');
  if (nameProp && nameProp.configurable) {
    fixedProp(func, 'name', name);
  }

  return func;
}

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
