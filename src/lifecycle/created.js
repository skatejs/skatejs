import data from '../util/data';
import eventsApplier from './events';
import patchAttributeMethods from './patch-attribute-methods';
import propertiesInit from './properties-init';
import prototypeApplier from './prototype';

function ensurePropertyFunctions (opts) {
  let properties = opts.properties;
  let names = Object.keys(properties || {});
  return names.reduce(function (descriptors, descriptorName) {
    descriptors[descriptorName] = opts.properties[descriptorName];
    if (typeof descriptors[descriptorName] !== 'function') {
      descriptors[descriptorName] = propertiesInit(descriptors[descriptorName]);
    }
    return descriptors;
  }, {});
}

function ensurePropertyDefinitions (elem, propertyFunctions) {
  return Object.keys(propertyFunctions || {}).reduce(function (descriptors, descriptorName) {
    descriptors[descriptorName] = propertyFunctions[descriptorName](descriptorName);
    return descriptors;
  }, {});
}

function iniitaliseProperties (elem, propertyDefinitions) {
  Object.keys(propertyDefinitions).forEach(function (name) {
    const prop = propertyDefinitions[name];
    prop.created(elem);

    // https://bugs.webkit.org/show_bug.cgi?id=49739
    //
    // When Webkit fixes that bug so that native property accessors can be
    // retrieved, we can move defining the property to the prototype and away
    // from having to do if for every instance as all other browsers support
    // this.
    Object.defineProperty(elem, name, prop);
  });
}

export default function (opts) {
  const {
    attribute,
    created,
    definedAttribute,
    events,
    isNative,
    properties,
    prototype,
    ready,
    render,
    renderedAttribute
  } = opts;
  const applyEvents = eventsApplier(opts);
  const applyPrototype = prototypeApplier(opts);
  const propertyFunctions = ensurePropertyFunctions(opts);

  // Performance critical code!
  return function () {
    const info = data(this);
    const propertyDefinitions = properties ? ensurePropertyDefinitions(this, propertyFunctions) : null;
    const readyCallbacks = info.readyCallbacks;

    if (info.created) {
      return;
    }

    info.created = true;

    if (!isNative) {
      if (attribute) {
        patchAttributeMethods(this);
      }

      if (prototype) {
        applyPrototype(this);
      }
    }

    if (propertyDefinitions) {
      iniitaliseProperties(this, propertyDefinitions);
    }

    if (events) {
      applyEvents(this);
    }

    if (created) {
      created(this);
    }

    if (render && !this.hasAttribute(renderedAttribute)) {
      render(this);
    }

    if (ready) {
      ready(this);
    }

    if (readyCallbacks) {
      readyCallbacks.forEach(cb => cb());
      info.readyCallbacks = null;
    }

    if (!this.hasAttribute(definedAttribute)) {
      this.setAttribute(definedAttribute, '');
    }
  };
}
