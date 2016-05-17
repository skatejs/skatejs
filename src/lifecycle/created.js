import data from '../util/data';
import eventsApplier from './events';
import patchAttributeMethods from './patch-attribute-methods';
import propertiesInit from './properties-init';
import prototypeApplier from './prototype';
import support from '../native/support';

const isPolyfilled = support.polyfilled;
const isCustomElementsV0 = support.v0;
const isCustomElementsV1 = support.v1;

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

function callAttributeChangedForEachAttribute (elem, observedAttributes) {
  observedAttributes.forEach(function (name) {
    const attr = elem.attributes[name];

    // We don't call it for the defined attribute because that will have
    // already called the handler via setAttribute().
    if (attr) {
      elem.attributeChangedCallback(name, null, attr.value);
    }
  });
}

function initialiseProperties (elem, propertyDefinitions) {
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
    created,
    definedAttribute,
    events,
    observedAttributes,
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
    const elemData = data(this);
    const propertyDefinitions = properties ? ensurePropertyDefinitions(this, propertyFunctions) : null;
    const readyCallbacks = elemData.readyCallbacks;

    if (elemData.created) {
      return;
    }

    elemData.created = true;

    if (isPolyfilled && prototype) {
      applyPrototype(this);
    }

    // Sets up properties, but does not invoke anything.
    if (propertyDefinitions) {
      initialiseProperties(this, propertyDefinitions);
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

    // Defined attribute is last before notifying listeners.
    if (!this.hasAttribute(definedAttribute)) {
      this.setAttribute(definedAttribute, '');
    }

    // We trigger ready after we add the defined attribute.
    if (readyCallbacks) {
      readyCallbacks.forEach(cb => cb());
      elemData.readyCallbacks = null;
    }

    // In Chrome's legacy implementation (v0), it queues microtasks to call
    // attributeChanged(). We can't just set a flag here to start triggering
    // and check in our attributeChanged() because any attribute changes that
    // happen before this point, will end up triggering attributeChanged()
    // *after* this point due to the microtask.
    if (isCustomElementsV0) {
      this.setAttribute('____can_start_triggering_now', '');
      this.removeAttribute('____can_start_triggering_now');
    }

    // We patch attribute methods here in full-polyfill-land so that
    // attributeChanged() is only fired after this point when an attribute is
    // changed. This is ok todo here because this isn't used in Chrome's v0
    // implementation.
    if (isPolyfilled) {
      patchAttributeMethods(this);
    }

    // Invoking the attribute handler should be emulated in non-v1-land. This
    // is supposed to happen after the constructor is called and this is the
    // closest point to that.
    if (!isCustomElementsV1) {
      // We force this flag to be true so that attributeChanged() actually gets
      // called in Chrome v0.
      elemData.canStartTriggeringNow = true;

      // Force the change.
      callAttributeChangedForEachAttribute(this, observedAttributes);

      // Now we turn it off so that Chrome v0 doesn't trigger attributeChanged()
      // until *after* it receives the set for "____can_start_triggering_now".
      elemData.canStartTriggeringNow = false;
    }
  };
}
