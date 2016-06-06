import { render } from '../api/symbols';
import data from '../util/data';
import eventsApplier from './events';
import propsInit from './props-init';

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

export default function (Ctor) {
  const {
    created,
    definedAttribute,
    events,
    props,
    ready,
    renderedAttribute
  } = Ctor;
  const applyEvents = eventsApplier(Ctor);
  const propertyFunctions = ensurePropertyFunctions(Ctor);
  const renderer = Ctor[render];

  // Performance critical code!
  return function (elem) {
    const elemData = data(elem);
    const propertyDefinitions = props ? ensurePropertyDefinitions(elem, propertyFunctions) : null;
    const readyCallbacks = elemData.readyCallbacks;

    if (elemData.created) {
      return;
    }

    elemData.created = true;

    // if (isPolyfilled && prototype) {
    //   applyPrototype(elem);
    // }

    // Sets up properties, but does not invoke anything.
    if (propertyDefinitions) {
      initialiseProps(elem, propertyDefinitions);
    }

    if (created) {
      created(elem);
    }

    if (renderer && !elem.hasAttribute(renderedAttribute)) {
      renderer(elem);
    }

    if (events) {
      applyEvents(elem);
    }

    if (ready) {
      ready(elem);
    }

    // Defined attribute is last before notifying listeners.
    if (!elem.hasAttribute(definedAttribute)) {
      elem.setAttribute(definedAttribute, '');
    }

    // We trigger ready after we add the defined attribute.
    if (readyCallbacks) {
      readyCallbacks.forEach(cb => cb(elem));
      delete elemData.readyCallbacks;
    }

    // // In the early versions of the spec ("v0", only implemented by Blink) all
    // // calls to setAttribute() would queue a task to execute the attributeChangedCallback.
    // // However, no attributes that exist when the element is upgraded would queue
    // // a task.
    // //
    // // In Custom Elements v1, nothing is queued until after the constructor
    // // (createdCallback in v0) is invoked. After it is invoked, the
    // // attributeChangedCallback() is executed for all existing attributes. All
    // // subsequent calls behave as normal.
    // //
    // // Any attribute change before this point is a no-op. Anything after works
    // // as normal.
    // if (isCustomElementsV0) {
    //   elem.setAttribute('____can_start_triggering_now', '');
    //   elem.removeAttribute('____can_start_triggering_now');
    // }

    // // Make attribute sets synchronous for polyfill-land.
    // if (isPolyfilled) {
    //   patchAttributeMethods(elem);
    // }

    // // Emulate v1 attribute initialisation behaviour.
    // if (!isCustomElementsV1) {
    //   // We force this flag to be true so that attributeChanged() actually gets
    //   // called in Chrome v0.
    //   elemData.canStartTriggeringNow = true;

    //   // Force the change.
    //   callAttributeChangedForEachAttribute(elem, observedAttributes);

    //   // Now we turn it off so that Chrome v0 doesn't trigger attributeChanged()
    //   // until *after* it receives the set for "____can_start_triggering_now".
    //   elemData.canStartTriggeringNow = false;
    // }
  };
}
