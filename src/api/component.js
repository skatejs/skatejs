import {
  connected as $connected,
  created as $created,
  props as $props,
  renderer as $renderer,
  rendererDebounced as $rendererDebounced,
} from '../util/symbols';
import { customElementsV0, reflect } from '../util/support';
import data from '../util/data';
import debounce from '../util/debounce';
import empty from '../util/empty';
import getAllKeys from '../util/get-all-keys';
import getOwnPropertyDescriptors from '../util/get-own-property-descriptors';

const setElementAsDefined = elem => elem.setAttribute('defined', '');

function callConstructor(elem) {
  const elemData = data(elem);
  const readyCallbacks = elemData.readyCallbacks;
  const Ctor = elem.constructor;
  const { created, observedAttributes, props } = Ctor;

  // Ensures that this can never be called twice.
  if (elem[$created]) {
    return;
  }

  elem[$created] = true;

  // Set up a renderer that is debounced for property sets to call directly.
  elem[$rendererDebounced] = debounce(Ctor[$renderer]);

  // Set up property lifecycle.
  if (props && Ctor[$props]) {
    Ctor[$props](elem);
  }

  // Props should be set up before calling this.
  if (created) {
    created(elem);
  }

  // Created should be set before invoking the ready listeners.
  if (readyCallbacks) {
    readyCallbacks.forEach(cb => cb(elem));
    delete elemData.readyCallbacks;
  }

  // In v0 we must ensure the attributeChangedCallback is called for attrs
  // that aren't linked to props so that the callback behaves the same no
  // matter if v0 or v1 is being used.
  if (customElementsV0) {
    observedAttributes.forEach((name) => {
      const propertyName = data(elem, 'attributeLinks')[name];
      if (!propertyName) {
        elem.attributeChangedCallback(name, null, elem.getAttribute(name));
      }
    });
  }
}

function callConnected(elem) {
  const Ctor = elem.constructor;
  const { attached } = Ctor;
  const render = Ctor[$renderer];

  elem[$connected] = true;

  if (typeof render === 'function') {
    render(elem);
  }

  if (typeof attached === 'function') {
    attached(elem);
  }
}

function callDisconnected(elem) {
  const { detached } = elem.constructor;

  elem[$connected] = false;

  if (typeof detached === 'function') {
    detached(elem);
  }
}

// v1
function Component(...args) {
  const elem = reflect ?
    Reflect.construct(HTMLElement, args, this.constructor) :
    HTMLElement.call(this, args[0]);
  callConstructor(elem);
  return elem;
}

// v1
Component.observedAttributes = [];

// Skate
Component.props = {};

// Skate
Component.extend = function extend(definition = {}, Base = this) {
  // Create class for the user.
  class Ctor extends Base {}

  // Pass on statics from the Base if not supported (IE 9 and 10).
  if (!Ctor.observedAttributes) {
    const staticOpts = getOwnPropertyDescriptors(Base);
    delete staticOpts.length;
    delete staticOpts.prototype;
    Object.defineProperties(Ctor, staticOpts);
  }

  // For inheriting from the object literal.
  const opts = getOwnPropertyDescriptors(definition);
  const prot = getOwnPropertyDescriptors(definition.prototype);

  // Prototype is non configurable (but is writable).
  delete opts.prototype;

  // Pass on static and instance members from the definition.
  Object.defineProperties(Ctor, opts);
  Object.defineProperties(Ctor.prototype, prot);

  return Ctor;
};

// Skate
//
// This is a default implementation that does strict equality copmarison on
// previous props and next props. It synchronously renders on the first prop
// that is different and returns immediately.
Component.updated = function updated(elem, prev) {
  if (!prev) {
    return true;
  }
  // use get all keys so that we check Symbols as well as regular props
  // using a for loop so we can break early
  const allKeys = getAllKeys(prev);
  for (let i = 0; i < allKeys.length; i += 1) {
    if (prev[allKeys[i]] !== elem[allKeys[i]]) {
      return true;
    }
  }
  return false;
};

function getPropData(elem, name) {
  const namespace = `api/property/${typeof name === 'symbol' ? String(name) : name}`;
  return data(elem, namespace);
}

// taken from props-init.js TODO split into helper
function getInitialValue(elem, name, opts) {
  return typeof opts.initial === 'function' ? opts.initial(elem, { name }) : opts.initial;
}

function syncPropsToAttrs(elem) {
  const props = elem.constructor.props;
  Object.keys(props).forEach((propName) => {
    const attributeName = data(elem, 'propertyLinks')[propName];
    if (!attributeName) return false;

    // let shouldRemoveAttribute = false;
    const propData = getPropData(elem, propName);
    const prop = props[propName];
    // console.log(prop, prop.internalValue);
    let syncAttrValue = propData.lastAssignedValue;
    // console.log('a:', syncAttrValue);
    if (empty(syncAttrValue) && prop.initial) {
      syncAttrValue = getInitialValue(elem, propName, prop);
    }
    if (!empty(syncAttrValue) && prop.serialize) {
      syncAttrValue = prop.serialize(syncAttrValue);
    }
    // console.log('b:', syncAttrValue);
    if (!empty(syncAttrValue)) {
      // console.log(`Setting ${propName} attr to ${syncAttrValue}`);
      propData.syncingAttribute = true;
      // propData.settingAttribute = false;
      elem.setAttribute(attributeName, syncAttrValue);
    }
  });
}

Component.prototype = Object.create(HTMLElement.prototype, {
  // v1
  connectedCallback: {
    configurable: true,
    value() {
      // console.log('connectedCallback', window.navigator.userAgent);
      syncPropsToAttrs(this);
      callConnected(this);
      setElementAsDefined(this);
    },
  },

  // v1
  disconnectedCallback: {
    configurable: true,
    value() {
      callDisconnected(this);
    },
  },

  // v0 and v1
  attributeChangedCallback: {
    configurable: true,
    value(name, oldValue, newValue) {
      // console.log('attributeChangedCallback', name, oldValue, newValue);
      const { attributeChanged, observedAttributes } = this.constructor;
      const propertyName = data(this, 'attributeLinks')[name];
      // console.log('propertyName', propertyName);

      // In V0 we have to ensure the attribute is being observed.
      if (customElementsV0 && observedAttributes.indexOf(name) === -1) {
        return;
      }

      if (propertyName) {
        const propData = data(this, `api/property/${propertyName}`);

        // This ensures a property set doesn't cause the attribute changed
        // handler to run again once we set this flag. This only ever has a
        // chance to run when you set an attribute, it then sets a property and
        // then that causes the attribute to be set again.
        if (propData.syncingAttribute) {
          // console.log('syncingAttribute');
          propData.syncingAttribute = false;
        } else {
          // Sync up the property.
          const propOpts = this.constructor.props[propertyName];
          // console.log(propOpts);
          propData.settingAttribute = true;
          this[propertyName] = newValue !== null && propOpts.deserialize ? propOpts.deserialize(newValue) : newValue;
        }
      }

      if (attributeChanged) {
        attributeChanged(this, { name, newValue, oldValue });
      }
    },
  },

  // v0
  createdCallback: {
    configurable: true,
    value() {
      callConstructor(this);
    },
  },

  // v0
  attachedCallback: {
    configurable: true,
    value() {
      // console.log('attachedCallback', window.navigator.userAgent);

      syncPropsToAttrs(this);

      callConnected(this);

      setElementAsDefined(this);
    },
  },

  // v0
  detachedCallback: {
    configurable: true,
    value() {
      callDisconnected(this);
    },
  },
});

export default Component;
