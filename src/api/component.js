import * as symbols from './symbols';
import data from '../util/data';
import getOwnPropertyDescriptors from '../util/get-own-property-descriptors';
import { customElementsV1 } from '../util/support';

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

    if (!customElementsV1 && observedAttributes.indexOf(name) === -1) {
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
    const elemData = data(this);
    const readyCallbacks = elemData.readyCallbacks;
    const Ctor = this.constructor;
    const { definedAttribute, events, created, props, ready, renderedAttribute } = Ctor;
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

    // In v0 we must initialise all existing observed attributes.
    if (!customElementsV1) {
      (this.constructor.observedAttributes || []).forEach(name => this.attributeChangedCallback(name, null, this.getAttribute(name)));
      Object.defineProperty(this, 'constructor', {
        get() {
          return Ctor;
        },
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
