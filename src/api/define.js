import * as symbols from './symbols';
import assign from 'object-assign';
import attached from '../lifecycle/attached';
import attributeChanged from '../lifecycle/attribute-changed';
import created from '../lifecycle/created';
import customElements from '../native/custom-elements';
import dashCase from '../util/dash-case';
import debounce from '../util/debounce';
import defaults from '../defaults';
import defineProperties from '../util/define-properties';
import detached from '../lifecycle/detached';
import documentObserver from '../native/document-observer';
import getAllPropertyDescriptors from '../util/get-all-property-descriptors';
import getOwnPropertyDescriptors from '../util/get-own-property-descriptors';
import init from './init';
import render from '../lifecycle/render';
import support from '../native/support';

const HTMLElement = window.HTMLElement;

// A function that initialises the document once in a given event loop.
const initDocument = debounce(function () {
  init(document.documentElement, { checkIfIsInDom: false });
});

// Creates a configurable, non-writable, non-enumerable property.
function fixedProp (obj, name, value) {
  Object.defineProperty(obj, name, {
    configurable: true,
    enumerable: false,
    value,
    writable: false
  });
}

// Makes a function / constructor for the custom element that automates the
// boilerplate of ensuring the parent constructor is called first and ensures
// that the element is returned at the end.
function createConstructor (name, opts) {
  // The constructor / function should work in polyfill, v0 and v1. In v1 we
  // pass the function by reference to the Reflect.construct() call so that it
  // can be invoked like a function even in native.
  function func () {
    let elem;
    if (support.v1) {
      elem = Reflect.construct(HTMLElement, arguments, func);
    } else if (support.v0) {
      elem = func.extends ? document.createElement(func.extends, name) : document.createElement(name);
    } else {
      if (func.extends) {
        elem = document.createElement(func.extends);
        elem.setAttribute('is', name);
      } else {
        elem = document.createElement(name);
      }
      init(elem);
    }
    func[symbols.created](elem);
    assign(elem, arguments[0]);
    return elem;
  }

  // Assigning defaults gives a predictable definition and prevents us from
  // having to do defaults checks everywhere.
  assign(func, defaults);

  // Inherit all options. This takes into account object literals as well as
  // ES2015 classes that may have inherited static props which would not be
  // considered "own".
  defineProperties(func, getAllPropertyDescriptors(opts));

  // Ensure the render function render's using Incremental DOM.
  func[symbols.render] = render(func);

  // Ensure a constructor is defined.
  fixedProp(func.prototype, 'constructor', func);
  fixedProp(func, 'id', name);

  return func;
}

// Ensures linked properties that have linked attributes are pre-formatted to
// the attribute name in which they are linked.
function formatLinkedAttributes (Ctor) {
  const { observedAttributes, props } = Ctor;

  if (!props) {
    return;
  }

  Object.keys(props).forEach(function (name) {
    const prop = props[name];
    const attr = prop.attribute;
    if (attr) {
      // Ensure the property is updated.
      const linkedAttr = prop.attribute = attr === true ? dashCase(name) : attr;

      // Automatically observe the attribute since they're linked from the
      // attributeChangedCallback.
      if (observedAttributes.indexOf(linkedAttr) === -1) {
        observedAttributes.push(linkedAttr);
      }
    }
  });
}

// If the options don't inherit a native element prototype, we ensure it does
// because native requires you explicitly do this. Here we solve the common
// use case by defaulting to HTMLElement.prototype.
function extendBasePrototype (Ctor) {
  if (!HTMLElement.prototype.isPrototypeOf(Ctor.prototype) && !SVGElement.prototype.isPrototypeOf(Ctor.prototype)) {
    const proto = (Ctor.extends ? document.createElement(Ctor.extends).constructor : HTMLElement).prototype;
    Ctor.prototype = Object.create(proto, getOwnPropertyDescriptors(Ctor.prototype));
  }
}

// Returns a function that invokes the specified lifecycle callback.
function callLifecycle (lifecycle) {
  return function () {
    lifecycle(this);
  };
}

// We assign native callbacks to handle the callbacks specified in the
// Skate definition. This allows us to abstract away any changes that may
// occur in the spec.
function createNativeCallbacks (Ctor) {
  const proto = Ctor.prototype;
  const callAttached = callLifecycle(Ctor[symbols.attached]);
  const callCreated = callLifecycle(Ctor[symbols.created]);
  const callDetached = callLifecycle(Ctor[symbols.detached]);

  // V0 and v1 have different callback names.
  if (support.v1) {
    assign(proto, {
      connectedCallback: callAttached,
      disconnectedCallback: callDetached
    });
  } else if (support.v0) {
    assign(proto, {
      attachedCallback: callAttached,
      createdCallback: callCreated,
      detachedCallback: callDetached
    });
  }

  // Both v0 and v1 have the same callback for attribute changes.
  const attributeChanged = Ctor[symbols.attributeChanged];
  proto.attributeChangedCallback = function (name, oldValue, newValue) {
    attributeChanged(this, name, oldValue, newValue);
  };
}

function createCommonLifecycleCallbacks (Ctor) {
  Ctor[symbols.created] = created(Ctor);
  Ctor[symbols.attached] = attached(Ctor);
  Ctor[symbols.detached] = detached(Ctor);
  Ctor[symbols.attributeChanged] = attributeChanged(Ctor);
}

// Ensures that in polyfill-land, theres an observer registered to handle
// incoming elements and that the current document is initialised.
function polyfilledDocumentObserver () {
  if (support.polyfilled) {
    initDocument();
    documentObserver.register();
  }
}

export default function (name, Ctor) {
  Ctor = createConstructor(name, Ctor);
  formatLinkedAttributes(Ctor);
  extendBasePrototype(Ctor);
  createCommonLifecycleCallbacks(Ctor);
  createNativeCallbacks(Ctor);
  polyfilledDocumentObserver();
  customElements.define(name, Ctor);
  return customElements.get(name);
}
