import { $ctor, $events, $name, $props, $renderer } from '../util/symbols';
import { customElementsV0, customElementsV0Polyfill, customElementsV1 } from '../util/support';
import Component from './component';
import createInitEvents from '../lifecycle/events';
import createRenderer from '../lifecycle/render';
import dashCase from '../util/dash-case';
import definePropertyConstructor from '../util/define-property-constructor';
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
    Ctor = Component.extend(Ctor);
  }

  // Internal data.
  Ctor[$name] = name;

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

  // Merge observed attributes.
  Object.defineProperty(Ctor, 'observedAttributes', {
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

export default function (name, Ctor) {
  Ctor = createConstructor(name, Ctor);
  formatLinkedAttributes(Ctor);

  Ctor[$events] = createInitEvents(Ctor);
  Ctor[$props] = createInitProps(Ctor);
  Ctor[$renderer] = createRenderer(Ctor);

  if (customElementsV0) {
    // These properties are necessary for the Custom Element v0 polyfill so
    // that we can fix it not working with extending the built-in HTMLElement.
    Ctor.prototype[$ctor] = Ctor;
    Ctor.prototype[$name] = name;
    const NewCtor = document.registerElement(name, Ctor);
    definePropertyConstructor(NewCtor.prototype, Ctor);
    return customElementsV0Polyfill ? Ctor : NewCtor;
  } else if (customElementsV1) {
    window.customElements.define(name, Ctor, { extends: Ctor.extends });
    return Ctor;
  } else {
    throw new Error('Skate requires native custom element support or a polyfill.');
  }
}
