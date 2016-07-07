import * as symbols from './symbols';
import { customElementsV0, customElementsV0Polyfill } from '../util/support';
import data from '../util/data';
import getOwnPropertyDescriptors from '../util/get-own-property-descriptors';

// In native Custom Elements v0, you can extend HTMLElement. In the polyfill
// you cannot, so we ensure the polyfill has a patched HTMLElement constructor.
if (customElementsV0Polyfill) {
  const proto = HTMLElement.prototype;
  window.HTMLElement = function () {
    const ctor = this[symbols.ctor];
    const name = this[symbols.name];
    const type = ctor.extends;
    return document.createElement(type || name, type ? name : null); 
  };
  HTMLElement.prototype = Object.create(proto);
  Object.defineProperty(HTMLElement.prototype, 'constructor', { enumerable: false, value: HTMLElement });
}

export default class Component extends HTMLElement {
  constructor () {
    super();
    this.createdCallback();
  }

  connectedCallback () {
    const cb = this.constructor.attached;
    cb && cb(this);
  }

  disconnectedCallback () {
    const cb = this.constructor.detached;
    cb && cb(this);
  }

  attributeChangedCallback (name, oldValue, newValue) {
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
        return;
      }

      // Sync up the property.
      const propOpts = this.constructor.props[propertyName];
      propData.settingAttribute = true;
      this[propertyName] = newValue !== null && propOpts.deserialize ? propOpts.deserialize(newValue) : newValue;
    }

    if (attributeChanged) {
      attributeChanged(this, { name, newValue, oldValue });
    }
  }

  createdCallback () {
    // In the polyfill, if you define a custom element after it has been
    // created the polyfill will call the constructor it has on record thus
    // ignoring the one the user has defined for the element. We ensure the
    // constructor is actually the one that was specified in the definition
    // rather than the one the polyfill gives it.
    //
    // In native v0 this behaves normally, so we only need to worry about the
    // polyfill here.
    if (customElementsV0Polyfill && this[symbols.ctor]) {
      Object.defineProperty(this, 'constructor', { enumerable: false, value: this[symbols.ctor] });
    }

    const elemData = data(this);
    const readyCallbacks = elemData.readyCallbacks;
    const Ctor = this.constructor;
    const { definedAttribute, events, created, observedAttributes, props, ready, renderedAttribute } = Ctor;
    const renderer = Ctor[symbols.renderer];

    // TODO: This prevents an element from being initialised multiple times. For
    // some reason this is happening in the event tests. It's possibly creating
    // elements in a way that the causes the custom element v1 polyfill to call
    // the constructor twice.
    if (this[symbols.created]) return;
    this[symbols.created] = true;

    if (props) {
      Ctor[symbols.props](this);
    }

    if (events) {
      Ctor[symbols.events](this);
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

    if (!this.hasAttribute(definedAttribute)) {
      this.setAttribute(definedAttribute, '');
    }

    if (readyCallbacks) {
      readyCallbacks.forEach(cb => cb(this));
      delete elemData.readyCallbacks;
    }

    // In v0 we must ensure the attributeChangedCallback is called for attrs
    // that aren't linked to props so that the callback behaves the same no
    // matter if v0 or v1 is being used.
    if (customElementsV0) {
      observedAttributes.forEach(name => {
        const propertyName = data(this, 'attributeLinks')[name];
        if (!propertyName) {
          this.attributeChangedCallback(name, null, this.getAttribute(name));
        }
      });
    }
  }

  attachedCallback () {
    this.connectedCallback();
  }

  detachedCallback () {
    this.disconnectedCallback();
  }

  static get definedAttribute () {
    return 'defined';
  }

  static get events () {
    return {};
  }

  static get observedAttributes () {
    return [];
  }

  static get props () {
    return {};
  }

  static get renderedAttribute () {
    return 'rendered';
  }

  static extend (definition = {}, Base = this) {
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
}
