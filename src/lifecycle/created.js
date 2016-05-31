import data from '../util/data';
import eventsApplier from './events';
import patchAttributeMethods from './patch-attribute-methods';
import propsInit from './props-init';
import prototypeApplier from './prototype';
import support from '../native/support';

const isPolyfilled = support.polyfilled;
const isCustomElementsV0 = support.v0;
const isCustomElementsV1 = support.v1;

function ensurePropertyFunctions (opts) {
  let props = opts.props;
  let names = Object.keys(props || {});
  return names.reduce(function (descriptors, descriptorName) {
    descriptors[descriptorName] = props[descriptorName];
    if (typeof descriptors[descriptorName] !== 'function') {
      descriptors[descriptorName] = propsInit(descriptors[descriptorName]);
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

function initialiseProps (elem, propertyDefinitions) {
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
    props,
    prototype,
    ready,
    renderer,
    renderedAttribute
  } = opts;
  const applyEvents = eventsApplier(opts);
  const applyPrototype = prototypeApplier(opts);
  const propertyFunctions = ensurePropertyFunctions(opts);

  // Performance critical code!
  return function () {
    const elemData = data(this);
    const propertyDefinitions = props ? ensurePropertyDefinitions(this, propertyFunctions) : null;
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
      initialiseProps(this, propertyDefinitions);
    }

    if (events) {
      applyEvents(this);
    }

    if (created) {
      created(this);
    }

    if (renderer && !this.hasAttribute(renderedAttribute)) {
      renderer(this);
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
      readyCallbacks.forEach(cb => cb(this));
      delete elemData.readyCallbacks;
    }

    // In the early versions of the spec ("v0", only implemented by Blink) all
    // calls to setAttribute() would queue a task to execute the attributeChangedCallback.
    // However, no attributes that exist when the element is upgraded would queue
    // a task.
    //
    // In Custom Elements v1, nothing is queued until after the constructor
    // (createdCallback in v0) is invoked. After it is invoked, the
    // attributeChangedCallback() is executed for all existing attributes. All
    // subsequent calls behave as normal.
    //
    // Any attribute change before this point is a no-op. Anything after works
    // as normal.
    if (isCustomElementsV0) {
      this.setAttribute('____can_start_triggering_now', '');
      this.removeAttribute('____can_start_triggering_now');
    }

    // Make attribute sets synchronous for polyfill-land.
    if (isPolyfilled) {
      patchAttributeMethods(this);
    }

    // Emulate v1 attribute initialisation behaviour.
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
