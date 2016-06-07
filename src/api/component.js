import * as symbols from './symbols';
import data from '../util/data';
import getOwnPropertyDescriptors from '../util/get-own-property-descriptors';

export default class Component extends HTMLElement {
  constructor () {
    super();

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

  static create (definition = {}, Base = Component) {
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
