import * as symbols from './symbols';
import { customElementsV1 } from '../util/support';
import attributeChanged from '../lifecycle/attribute-changed';
import Component from './component';
import createInitEvents from '../lifecycle/events';
import createRenderer from '../lifecycle/render';
import dashCase from '../util/dash-case';
import getAllPropertyDescriptors from '../util/get-all-property-descriptors';
import getOwnPropertyDescriptors from '../util/get-own-property-descriptors';
import initProps from '../lifecycle/props-init';

// Ensures that definitions passed as part of the constructor are functions
// that return property definitions used on the element.
function ensurePropertyFunctions (Ctor) {
  let props = Ctor.props;
  let names = Object.keys(props || {});
  return names.reduce(function (descriptors, descriptorName) {
    descriptors[descriptorName] = props[descriptorName];
    if (typeof descriptors[descriptorName] !== 'function') {
      descriptors[descriptorName] = initProps(descriptors[descriptorName]);
    }
    return descriptors;
  }, {});
}

// Ensures the property definitions are transformed to objects that can be used
// to create properties on the element.
function ensurePropertyDefinitions (Ctor) {
  const props = ensurePropertyFunctions(Ctor);
  return Object.keys(props).reduce(function (descriptors, descriptorName) {
    descriptors[descriptorName] = props[descriptorName](descriptorName);
    return descriptors;
  }, {});
}

// Makes a function / constructor for the custom element that automates the
// boilerplate of ensuring the parent constructor is called first and ensures
// that the element is returned at the end.
function createConstructor (name, Ctor) {
  if (typeof Ctor === 'object') {
    const opts = getAllPropertyDescriptors(Ctor);
    const prot = getOwnPropertyDescriptors(Ctor.prototype);

    // The prototype is non-configurable, so we remove it before it tries to
    // define it.
    delete opts.prototype;

    Ctor = class extends Component {};

    Object.defineProperties(Ctor, opts);
    Object.defineProperties(Ctor.prototype, prot);
  }

  Ctor.prototype.attributeChangedCallback = attributeChanged(Ctor);
  Ctor.prototype.connectedCallback = function () { Ctor.attached && Ctor.attached(this); };
  Ctor.prototype.disconnectedCallback = function () { Ctor.detached && Ctor.detached(this); };

  // WebKit currently doesn't allow you to overwrite "name" so we have to use
  // "id" for cross-browser compat right now.
  Object.defineProperty(Ctor, 'id', { value: name });

  // We do set "name" in browsers that support it, though.
  const nameDesc = Object.getOwnPropertyDescriptor(Ctor, 'name');
  if (nameDesc && nameDesc.configurable) {
    Object.defineProperty(Ctor, 'name', { value: name });
  }

  return Ctor;
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

  Ctor.observedAttributes = observedAttributes;
}

function createInitProps (Ctor) {
  const props = ensurePropertyDefinitions(Ctor);

  return function (elem) {
    if (!props) {
      return;
    }

    Object.keys(props).forEach(function (name) {
      const prop = props[name];
      prop.created(elem);

      // https://bugs.webkit.org/show_bug.cgi?id=49739
      //
      // When Webkit fixes that bug so that native property accessors can be
      // retrieved, we can move defining the property to the prototype and away
      // from having to do if for every instance as all other browsers support
      // this.
      Object.defineProperty(elem, name, prop);
    });
  };
}

export default function (name, Ctor) {
  Ctor = createConstructor(name, Ctor);
  formatLinkedAttributes(Ctor);
  Ctor[symbols.events] = createInitEvents(Ctor);
  Ctor[symbols.props] = createInitProps(Ctor);
  Ctor[symbols.renderer] = createRenderer(Ctor);
  if (customElementsV1) {
    window.customElements.define(name, Ctor);
    return window.customElements.get(name);
  } else {
    throw new Error('Skate requires custom element v1 support. Please include a polyfill for this browser.');
  }
}
