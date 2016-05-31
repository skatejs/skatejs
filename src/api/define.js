import assign from 'object-assign';
import attached from '../lifecycle/attached';
import attribute from '../lifecycle/attribute-changed';
import create from './create';
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
import render from '../lifecycle/render';
import support from '../native/support';
import walkTree from '../util/walk-tree';

const HTMLElement = window.HTMLElement;

// A function that initialises the document once in a given event loop.
const initDocument = debounce(function () {
  walkTree(document.documentElement.childNodes, function (element) {
    const component = customElements.get(element.tagName.toLowerCase());

    if (component) {
      if (component.prototype.createdCallback) {
        component.prototype.createdCallback.call(element);
      }

      if (component.prototype.attachedCallback) {
        component.prototype.attachedCallback.call(element);
      }
    }
  });
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

// Makes a function / constructor that can be called as either.
function createConstructor (name, opts) {
  const func = create.bind(null, name);

  // Assigning defaults gives a predictable definition and prevents us from
  // having to do defaults checks everywhere.
  assign(func, defaults);

  // Inherit all options. This takes into account object literals as well as
  // ES2015 classes that may have inherited static props which would not be
  // considered "own".
  defineProperties(func, getAllPropertyDescriptors(opts));

  return func;
}

function addConstructorInformation (name, Ctor) {
  fixedProp(Ctor.prototype, 'constructor', Ctor);
  fixedProp(Ctor, 'id', name);

  // In native, the function name is the same as the custom element name, but
  // WebKit prevents this from being defined. We do this where possible and
  // still define `id` for cross-browser compatibility.
  const nameProp = Object.getOwnPropertyDescriptor(Ctor, 'name');
  if (nameProp && nameProp.configurable) {
    fixedProp(Ctor, 'name', name);
  }
}

// Ensures linked properties that have linked attributes are pre-formatted to
// the attribute name in which they are linked.
function ensureLinkedAttributesAreFormatted (opts) {
  const { observedAttributes, props } = opts;

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

export default function (name, opts) {
  // Ensure the observed attributes are initialised.
  opts.observedAttributes = opts.observedAttributes || [];

  // Ensure the render function render's using Incremental DOM.
  opts.renderer = render(opts);

  const Ctor = createConstructor(name, opts);
  addConstructorInformation(name, Ctor);
  ensureLinkedAttributesAreFormatted(Ctor);

  // If the options don't inherit a native element prototype, we ensure it does
  // because native requires you explicitly do this. Here we solve the common
  // use case by defaulting to HTMLElement.prototype.
  if (!HTMLElement.prototype.isPrototypeOf(Ctor.prototype) && !SVGElement.prototype.isPrototypeOf(Ctor.prototype)) {
    const proto = (Ctor.extends ? document.createElement(Ctor.extends).constructor : HTMLElement).prototype;
    Ctor.prototype = Object.create(proto, getOwnPropertyDescriptors(Ctor.prototype));
  }

  // We assign native callbacks to handle the callbacks specified in the
  // Skate definition. This allows us to abstract away any changes that may
  // occur in the spec.
  assign(Ctor.prototype, {
    createdCallback: created(Ctor),
    attachedCallback: attached(Ctor),
    detachedCallback: detached(Ctor),
    attributeChangedCallback: attribute(Ctor)
  });

  // In polyfill land we must emulate what the browser would normally do in
  // native.
  if (support.polyfilled) {
    initDocument();
    documentObserver.register();
  }

  customElements.define(name, Ctor);
  return customElements.get(name);
}
