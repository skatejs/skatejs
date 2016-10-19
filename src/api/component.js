import { patchInner } from 'incremental-dom';
import {
  connected as $connected,
  created as $created,
  props as $props,
  renderer as $render,
  rendererDebounced as $renderDebounced,
  rendering as $rendering,
  shadowRoot as $shadowRoot,
  updated as $updated
} from '../util/symbols';
import {
  reflect
} from '../util/support';
import data from '../util/data';
import debounce from '../util/debounce';
import getAllKeys from '../util/get-all-keys';
import getOwnPropertyDescriptors from '../util/get-own-property-descriptors';
import getSetProps from './props';
import overridePropertyGetter from '../util/override-property-getter';
import prop from '../util/prop';
import syncPropToAttr from '../util/sync-prop-to-attr';
import uniqueId from '../util/unique-id';

const { HTMLElement } = window;

function attachShadow (elem) {
  return elem[$shadowRoot] = elem[$shadowRoot] || (elem.attachShadow ? elem.attachShadow({ mode: 'open' }) : elem);
}

function syncPropsToAttrs (elem) {
  const props = elem.constructor.props;
  Object.keys(props).forEach((propName) => {
    const prop = props[propName];
    syncPropToAttr(elem, prop, propName, true);
  });
}

function Component (...args) {
  const elem = reflect
    ? Reflect.construct(HTMLElement, args, this.constructor)
    : HTMLElement.call(this, args[0]);
  
  const elemData = data(elem);
  const readyCallbacks = elemData.readyCallbacks;
  const { constructor } = elem;

  // Ensures that this can never be called twice.
  if (elem[$created]) {
    return;
  }

  elem[$created] = true;

  // Set up a renderer that is debounced for property sets to call directly.
  elem[$renderDebounced] = debounce(elem[$render].bind(elem));

  // Set up property lifecycle.
  if (constructor.props && constructor[$props]) {
    constructor[$props](elem);
  }

  // DEPRECATED static render()
  if (!elem.renderCallback && constructor.render) {
    elem.renderCallback = constructor.render.bind(constructor, elem);
  }

  // Props should be set up before calling this.
  if (typeof constructor.created === 'function') {
    constructor.created(elem);
  }

  // Created should be set before invoking the ready listeners.
  if (readyCallbacks) {
    readyCallbacks.forEach(cb => cb(elem));
    delete elemData.readyCallbacks;
  }

  return elem;
}

Component.observedAttributes = [];

// Skate
Component.props = {};

// Skate
Object.defineProperty(Component, 'id', prop({
  get: uniqueId,
  set: overridePropertyGetter
}));

// Skate
Component.extend = function extend (definition = {}, Base = this) {
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

// DEPRECATED static updated()
Component.updated = function _updated (elem, prev) {
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

// DEPRECATED
Component.rendered = function _rendered () {};

// DEPRECATED
Component.renderer = function _renderer (elem) {
  patchInner(elem[$shadowRoot], () => {
    const possibleFn = elem.renderCallback();
    if (typeof possibleFn === 'function') {
      possibleFn();
    } else if (Array.isArray(possibleFn)) {
      possibleFn.forEach((fn) => {
        if (typeof fn === 'function') {
          fn();
        }
      });
    }
  });
};

Component.prototype = Object.create(HTMLElement.prototype, {
  connectedCallback: prop({
    value () {
      const { constructor } = this;

      syncPropsToAttrs(this);

      this[$connected] = true;
      this[$renderDebounced]();

      // DEPRECATED static attached()
      if (typeof constructor.attached === 'function') {
        constructor.attached(this);
      }

      this.setAttribute('defined', '');
    }
  }),

  disconnectedCallback: prop({
    value () {
      const { constructor } = this;

      this[$connected] = false;

      // DEPRECATED static detached()
      if (typeof constructor.detached === 'function') {
        constructor.detached(this);
      }
    }
  }),

  attributeChangedCallback: prop({
    value (name, oldValue, newValue) {
      const { attributeChanged, observedAttributes } = this.constructor;
      const propertyName = data(this, 'attributeLinks')[name];

      if (propertyName) {
        const propData = data(this, 'props')[propertyName];

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
          const newPropVal = newValue !== null && propOpts.deserialize
            ? propOpts.deserialize(newValue)
            : newValue;
          this[propertyName] = newPropVal;
        }
      }

      if (attributeChanged) {
        attributeChanged(this, { name, newValue, oldValue });
      }
    }
  }),

  // Skate
  //
  // This is a default implementation that does strict equality comparison on
  // previous props and next props. It synchronously renders on the first prop
  // that is different and returns immediately.
  updatedCallback: prop({
    value (prev) {
      return this.constructor.updated(this, prev);
    }
  }),

  // Skate
  //
  // Defaults to null because the rendering process is opt-in.
  renderCallback: prop({
    value: null
  }),

  // Skate
  //
  // Defaults to noop because that way we don't have to check.
  renderedCallback: prop({
    value () {
      return this.constructor.rendered(this);
    }
  }),

  // Skate
  //
  // Default Incremental DOM renderer. Can be overridden to use any virtual DOM
  // library.
  rendererCallback: prop({
    value () {
      return this.constructor.renderer(this);
    }
  }),

  // Skate
  //
  // Invokes the complete render lifecycle.
  [$render]: prop({
    value () {
      if (this[$rendering] || !this[$connected]) {
        return;
      }

      // Flag as rendering. This prevents anything from trying to render - or
      // queueing a render - while there is a pending render.
      this[$rendering] = true;

      if (this[$updated]() && typeof this.renderCallback === 'function') {
        attachShadow(this);
        this.rendererCallback();
        this.renderedCallback();
      }

      this[$rendering] = false;
    }
  }),

  // Skate
  //
  // Calls the user-defined updated() lifecycle callback.
  [$updated]: prop({
    value () {
      const prev = this[$props];
      this[$props] = getSetProps(this);
      return this.updatedCallback(prev);
    }
  })
});

export default Component;
