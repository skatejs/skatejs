import data from '../util/data';
import eventsApplier from './events';
import patchAttributeMethods from './patch-attribute-methods';
import propertiesInit from './properties-init';
import propertiesCreated from './properties-created';
import propertiesReady from './properties-ready';
import prototypeApplier from './prototype';
import resolve from './resolve';

// TODO Remove this when we no longer support the legacy definitions and only
// support a superset of a native property definition.
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

export default function (opts) {
  const {
    attribute,
    created,
    events,
    isNative,
    properties,
    prototype,
    ready,
    render,
    resolvedAttribute
  } = opts;
  const applyEvents = eventsApplier(opts);
  const applyPrototype = prototypeApplier(opts);
  const propertyFunctions = ensurePropertyFunctions(opts);

  // Performance critical code!
  return function () {
    const info = data(this);
    const resolved = this.hasAttribute(resolvedAttribute);
    const propertyDefinitions = properties ? ensurePropertyDefinitions(this, propertyFunctions) : null;

    if (info.created) return;
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
      propertiesCreated(this, propertyDefinitions);
    }

    if (events) {
      applyEvents(this);
    }

    if (created) {
      created(this);
    }

    if (render && !resolved) {
      render(this);
    }

    if (propertyDefinitions) {
      propertiesReady(this, propertyDefinitions);
    }

    if (ready) {
      ready(this);
    }

    if (info.readyCallbacks) {
      info.readyCallbacks.forEach(cb => cb());
      info.readyCallbacks = null;
    }

    if (!resolved) {
      resolve(this, opts);
    }
  };
}
