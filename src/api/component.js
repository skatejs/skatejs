import {
  connected as $connected,
  created as $created,
  props as $props,
  renderer as $renderer,
  rendererDebounced as $rendererDebounced,
} from '../util/symbols';
import { customElementsV0 } from '../util/support';
import data from '../util/data';
import debounce from '../util/debounce';
import getOwnPropertyDescriptors from '../util/get-own-property-descriptors';

function callConstructor(elem) {
  const elemData = data(elem);
  const readyCallbacks = elemData.readyCallbacks;
  const Ctor = elem.constructor;
  const { created, observedAttributes, props } = Ctor;

  // Ensures that this can never be called twice.
  if (elem[$created]) return;
  elem[$created] = true;

  // Set up a renderer that is debounced for property sets to call directly.
  elem[$rendererDebounced] = debounce(Ctor[$renderer]);

  if (props) {
    Ctor[$props](elem);
  }

  if (created) {
    created(elem);
  }

  elem.setAttribute('defined', '');

  if (readyCallbacks) {
    readyCallbacks.forEach(cb => cb(elem));
    delete elemData.readyCallbacks;
  }

  // In v0 we must ensure the attributeChangedCallback is called for attrs
  // that aren't linked to props so that the callback behaves the same no
  // matter if v0 or v1 is being used.
  if (customElementsV0) {
    observedAttributes.forEach(name => {
      const propertyName = data(elem, 'attributeLinks')[name];
      if (!propertyName) {
        elem.attributeChangedCallback(name, null, elem.getAttribute(name));
      }
    });
  }
}

function callConnected(elem) {
  const ctor = elem.constructor;
  const { attached } = ctor;
  const render = ctor[$renderer];
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

export default class Component extends HTMLElement {
  // v1
  constructor(self) {
    const elem = super(self);
    callConstructor(elem);
    return elem;
  }

  // v1
  connectedCallback() {
    callConnected(this);
  }

  // v1
  disconnectedCallback() {
    callDisconnected(this);
  }

  // v0 and v1
  attributeChangedCallback(name, oldValue, newValue) {
    const { attributeChanged, observedAttributes } = this.constructor;
    const propertyName = data(this, 'attributeLinks')[name];

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
        propData.syncingAttribute = false;
      } else {
        // Sync up the property.
        const propOpts = this.constructor.props[propertyName];
        propData.settingAttribute = true;
        this[propertyName] = newValue !== null && propOpts.deserialize ? propOpts.deserialize(newValue) : newValue;
      }
    }

    if (attributeChanged) {
      attributeChanged(this, { name, newValue, oldValue });
    }
  }

  // v0
  createdCallback() {
    callConstructor(this);
  }

  // v0
  attachedCallback() {
    callConnected(this);
  }

  // v0
  detachedCallback() {
    callDisconnected(this);
  }

  // v1
  static get observedAttributes() {
    return [];
  }

  // Skate
  static get props() {
    return {};
  }

  // Skate
  static extend(definition = {}, Base = this) {
    // Create class for the user.
    class Ctor extends Base {}

    // For inheriting from the object literal.
    const opts = getOwnPropertyDescriptors(definition);
    const prot = getOwnPropertyDescriptors(definition.prototype);

    // Prototype is non configurable (but is writable) s
    delete opts.prototype;

    // Pass on static and instance members from the definition.
    Object.defineProperties(Ctor, opts);
    Object.defineProperties(Ctor.prototype, prot);

    return Ctor;
  }

  // Skate
  //
  // This is a default implementation that does strict equality copmarison on
  // prevoius props and next props. It synchronously renders on the first prop
  // that is different and returns immediately.
  static updated(elem, prev) {
    if (!prev) {
      return true;
    }

    // eslint-disable-next-line no-restricted-syntax
    for (const name in prev) {
      if (prev[name] !== elem[name]) {
        return true;
      }
    }
  }
}
