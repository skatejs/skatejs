import { 
  ctor as $ctor, 
  events as $events, 
  name as $name, 
  props as $props, 
  renderer as $renderer 
} from '../util/symbols';
import { customElementsV0, customElementsV0Polyfill, customElementsV1 } from '../util/support';
import Component from './component';
import createInitEvents from '../lifecycle/events';
import createRenderer from '../lifecycle/render';
import dashCase from '../util/dash-case';
import definePropertyConstructor from '../util/define-property-constructor';
import initProps from '../lifecycle/props-init';

const registry = {};

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

  // Merge observed attributes.
  Object.defineProperty(Ctor, 'observedAttributes', {
    configurable: true,
    enumerable: true,
    get () {
      return observedAttributes;
    }
  });
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

function generateUniqueName(name) {
  const registered = registry[name];
  return registered ? `${name}-${registered}` : name;
}

function registerUniqueName(name) {
  registry[name] = registry[name] ? registry[name] + 1 : 1;
}

export default function (name, opts) {
  const uniqueName = generateUniqueName(name);
  const Ctor = typeof opts === 'object' ? Component.extend(opts) : opts;

  registerUniqueName(name);
  formatLinkedAttributes(Ctor);

  Ctor[$events] = createInitEvents(Ctor);
  Ctor[$name] = uniqueName;
  Ctor[$props] = createInitProps(Ctor);
  Ctor[$renderer] = createRenderer(Ctor);

  if (customElementsV0) {
    // These properties are necessary for the Custom Element v0 polyfill so
    // that we can fix it not working with extending the built-in HTMLElement.
    Ctor.prototype[$ctor] = Ctor;
    Ctor.prototype[$name] = uniqueName;
    const NewCtor = document.registerElement(uniqueName, Ctor);
    definePropertyConstructor(NewCtor.prototype, Ctor);
    return customElementsV0Polyfill ? Ctor : NewCtor;
  } else if (customElementsV1) {
    window.customElements.define(uniqueName, Ctor, { extends: Ctor.extends });
  } else {
    throw new Error('Skate requires native custom element support or a polyfill.');
  }

  return Ctor;
}
