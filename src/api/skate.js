import assign from 'object-assign';
import attached from '../lifecycle/attached';
import attribute from '../lifecycle/attribute';
import create from './create';
import created from '../lifecycle/created';
import createElement from '../native/create-element';
import customElements from '../native/custom-elements';
import data from '../data';
import defaults from '../defaults';
import detached from '../lifecycle/detached';
import documentObserver from '../native/document-observer';
import render from '../lifecycle/render';
import support from '../native/support';
import utilGetAllPropertyDescriptors from '../util/get-all-property-descriptors';
import utilGetOwnPropertyDescriptors from '../util/get-own-property-descriptors';
import utilDebounce from '../util/debounce';
import utilDefineProperties from '../util/define-properties';
import utilWalkTree from '../util/walk-tree';

const HTMLElement = window.HTMLElement;

// A function that initialises the document once in a given event loop.
const initDocument = utilDebounce(function () {
  utilWalkTree(document.documentElement.childNodes, function (element) {
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
  utilDefineProperties(func, utilGetAllPropertyDescriptors(opts));

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

// When passing props, Incremental DOM defaults to setting an attribute. When
// you pass around data to components it's better to use properties because you
// can pass things other than strings. This tells incremental DOM to use props
// for all defined properties on components.
function ensureIncrementalDomKnowsToSetPropsForLinkedAttrs (name, opts) {
  Object.keys(opts).forEach(function (optKey) {
    const propKey = name + '.' + optKey;
    data.applyProp[propKey] = true;
  });
}

// The main skate() function.
export default function (name, opts) {
  // Ensure the render function render's using Incremental DOM.
  opts.render = render(opts);

  const Ctor = createConstructor(name, opts);
  addConstructorInformation(name, Ctor);
  ensureIncrementalDomKnowsToSetPropsForLinkedAttrs(name, opts);

  // If the options don't inherit a native element prototype, we ensure it does
  // because native requires you explicitly do this. Here we solve the common
  // use case by defaulting to HTMLElement.prototype.
  if (!HTMLElement.prototype.isPrototypeOf(Ctor.prototype) && !SVGElement.prototype.isPrototypeOf(Ctor.prototype)) {
    const proto = (Ctor.extends ? createElement(Ctor.extends).constructor : HTMLElement).prototype;
    Ctor.prototype = Object.create(proto, utilGetOwnPropertyDescriptors(Ctor.prototype));
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
