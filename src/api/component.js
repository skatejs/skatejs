import * as symbols from './symbols';
import assign from 'object-assign';
import data from '../util/data';
import getOwnPropertyDescriptors from '../util/get-own-property-descriptors';
import { classes } from '../util/support';

function init (elem) {
  const elemData = data(elem);
  const readyCallbacks = elemData.readyCallbacks;
  const Ctor = elem.constructor;
  const { definedAttribute, events, created, props, ready, renderedAttribute } = Ctor;
  const renderer = Ctor[symbols.renderer];

  // TODO: This prevents an element from being initialised multiple times. For
  // some reason this is happening with the V1 polyfill. We should try and
  // figure out why.
  if (elem.____created) return;
  elem.____created = true;

  if (props) {
    Ctor[symbols.props](elem);
  }

  if (events) {
    Ctor[symbols.events](elem);
  }

  if (created) {
    created(elem);
  }

  if (renderer && !elem.hasAttribute(renderedAttribute)) {
    renderer(elem);
  }

  if (ready) {
    ready(elem);
  }

  if (!elem.hasAttribute(definedAttribute)) {
    elem.setAttribute(definedAttribute, '');
  }

  if (readyCallbacks) {
    readyCallbacks.forEach(cb => cb(elem));
    delete elemData.readyCallbacks;
  }
}

export default class Component extends HTMLElement {
  constructor () {
    super();
    init(this);
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

  static create (definition = {}) {
    function Ctor () {
      const elem = HTMLElement.call(this);
      init(elem);
      return elem;
    }

    // Merge both the static options from Component and override with user-defined ones.
    const opts = assign(getOwnPropertyDescriptors(this), getOwnPropertyDescriptors(definition));

    // Merge both the user-defined prototype but ensure "constructor" is correctly set to Ctor.
    const prot = assign(getOwnPropertyDescriptors(definition.prototype), getOwnPropertyDescriptors(Ctor.prototype));

    // Prototype is non configurable (but is writable).
    delete opts.prototype;

    // Pass on static members.
    // We can't just call Object.defineProperties() because WebKit has a lot of
    // non-configurable properties which we must filter out. These won't be any
    // we need anyways.
    for (let name in opts) {
      const prop = opts[name];
      if (prop.configurable) {
        Object.defineProperty(Ctor, name, opts[name]);
      }
    }

    // Setup with the correct prototype.
    Ctor.prototype = Object.create(HTMLElement.prototype, prot);

    // Provide a setter for __proto__ as this is what the v1 polyfill uses to
    // set the prototype. This may not be necessary if attributeChangedCallback
    // is fired for existing attributes in a micro / macro task instead of
    // synchronously as it is now.
    if (!classes) {
      Object.defineProperty(Element.prototype, '__proto__', {
        configurable: true,
        enumerable: false,
        get () {
          return this.constructor.prototype;
        },
        set (prototype) {
          const prot = getOwnPropertyDescriptors(prototype);
          for (let name in prot) {
            Object.defineProperty(this, name, prot[name]);
          }
        }
      });
    }

    return Ctor;
  }
}
