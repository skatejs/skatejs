import {
  name as $name,
  props as $props,
  renderer as $renderer,
} from '../util/symbols';
import { customElementsV0, customElementsV1 } from '../util/support';
import Component from './component';
import createRenderer from '../lifecycle/render';
import dashCase from '../util/dash-case';
import initProps from '../lifecycle/props-init';
import rand from '../util/rand';

const { customElements } = window;

// Ensures that definitions passed as part of the constructor are functions
// that return property definitions used on the element.
function ensurePropertyFunctions(Ctor) {
  const props = Ctor.props;
  const names = Object.keys(props || {});
  return names.reduce((descriptors, descriptorName) => {
    descriptors[descriptorName] = props[descriptorName];
    if (typeof descriptors[descriptorName] !== 'function') {
      descriptors[descriptorName] = initProps(descriptors[descriptorName]);
    }
    return descriptors;
  }, {});
}

// Ensures the property definitions are transformed to objects that can be used
// to create properties on the element.
function ensurePropertyDefinitions(Ctor) {
  const props = ensurePropertyFunctions(Ctor);
  return Object.keys(props).reduce((descriptors, descriptorName) => {
    descriptors[descriptorName] = props[descriptorName](descriptorName);
    return descriptors;
  }, {});
}

// Ensures linked properties that have linked attributes are pre-formatted to
// the attribute name in which they are linked.
function formatLinkedAttributes(Ctor) {
  const { observedAttributes, props } = Ctor;

  if (!props) {
    return;
  }

  Object.keys(props).forEach((name) => {
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

  // Merge observed attributes.
  Object.defineProperty(Ctor, 'observedAttributes', {
    configurable: true,
    enumerable: true,
    get() {
      return observedAttributes;
    },
  });
}

function createInitProps(Ctor) {
  const props = ensurePropertyDefinitions(Ctor);

  return (elem) => {
    if (!props) {
      return;
    }

    Object.keys(props).forEach((name) => {
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

function prepareForRegistration(name, Ctor, { unique } = {}) {
  Ctor[$props] = createInitProps(Ctor);
  Ctor[$renderer] = createRenderer(Ctor);
  Ctor.id = name;
  Ctor.uniqueId = Ctor[$name] = unique ? `${name}-${rand()}` : name;
}

function registerV0Element(name, Ctor) {
  try {
    prepareForRegistration(name, Ctor);
    return document.registerElement(Ctor.uniqueId, Ctor);
  } catch (e) {
    prepareForRegistration(name, Ctor, { unique: true });
    return document.registerElement(Ctor.uniqueId, Ctor);
  }
}

function registerV1Element(name, Ctor) {
  prepareForRegistration(name, Ctor, { unique: customElements.get(name) });
  customElements.define(Ctor.uniqueId, Ctor, { extends: Ctor.extends });
  return Ctor;
}

export default function (name, opts) {
  if (opts === undefined) {
    throw new Error(`You have to define options to register a component ${name}`);
  }
  const Ctor = typeof opts === 'object' ? Component.extend(opts) : opts;
  formatLinkedAttributes(Ctor);

  if (customElementsV1) {
    return registerV1Element(name, Ctor);
  } else if (customElementsV0) {
    return registerV0Element(name, Ctor);
  }

  throw new Error('Skate requires native custom element support or a polyfill.');
}
