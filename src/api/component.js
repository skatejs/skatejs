import {
  connected as $connected,
  created as $created,
  props as $props,
  renderer as $renderer,
  rendererDebounced as $rendererDebounced,
  rendering as $rendering,
  shadowRoot as $shadowRoot,
  updated as $updated
} from '../util/symbols';
import {
  renderer as idomRenderer
} from '../renderer/idom';
import {
  customElementsV0,
  reflect,
  shadowDomV0,
  shadowDomV1
} from '../util/support';
import data from '../util/data';
import debounce from '../util/debounce';
import getAllKeys from '../util/get-all-keys';
import getOwnPropertyDescriptors from '../util/get-own-property-descriptors';
import getSetProps from './props';
import syncPropToAttr from '../util/sync-prop-to-attr';

const { HTMLElement } = window;

// Abstracts shadow root across v1, v0 and no support.
// Once v1 is supported everywhere, we can call elem.attachShadow() directly
// and remove this function.
function attachShadow (elem) {
  if (shadowDomV1) {
    return elem.attachShadow({ mode: 'open' });
  } else if (shadowDomV0) {
    return elem.createShadowRoot();
  }
  return elem;
}

function getOrAttachShadow (elem) {
  return elem[$shadowRoot] || (elem[$shadowRoot] = attachShadow(elem));
}

function callConstructor (elem) {
  const elemData = data(elem);
  const readyCallbacks = elemData.readyCallbacks;
  const { constructor } = elem;

  // Ensures that this can never be called twice.
  if (elem[$created]) {
    return;
  }

  elem[$created] = true;

  // Set up a renderer that is debounced for property sets to call directly.
  elem[$rendererDebounced] = debounce(constructor[$renderer].bind(constructor));

  // Set up property lifecycle.
  if (constructor.props && constructor[$props]) {
    constructor[$props](elem);
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

  // In v0 we must ensure the attributeChangedCallback is called for attrs
  // that aren't linked to props so that the callback behaves the same no
  // matter if v0 or v1 is being used.
  if (customElementsV0) {
    constructor.observedAttributes.forEach((name) => {
      const propertyName = data(elem, 'attributeLinks')[name];
      if (!propertyName) {
        elem.attributeChangedCallback(name, null, elem.getAttribute(name));
      }
    });
  }
}

function syncPropsToAttrs (elem) {
  const props = elem.constructor.props;
  Object.keys(props).forEach((propName) => {
    const prop = props[propName];
    syncPropToAttr(elem, prop, propName, true);
  });
}

function callConnected (elem) {
  const { constructor } = elem;

  syncPropsToAttrs(elem);

  elem[$connected] = true;
  elem[$rendererDebounced](elem);

  if (typeof constructor.attached === 'function') {
    constructor.attached(elem);
  }

  elem.setAttribute('defined', '');
}

function callDisconnected (elem) {
  const { constructor } = elem;

  elem[$connected] = false;

  if (typeof constructor.detached === 'function') {
    constructor.detached(elem);
  }
}

// v1
function Component (...args) {
  const elem = reflect
    ? Reflect.construct(HTMLElement, args, this.constructor)
    : HTMLElement.call(this, args[0]);
  callConstructor(elem);
  return elem;
}

// v1
Component.observedAttributes = [];

// Skate
Component.props = {};

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

// Skate
//
// Incremental DOM renderer.
Component.renderer = idomRenderer;

// Skate
//
// This is a default implementation that does strict equality copmarison on
// previous props and next props. It synchronously renders on the first prop
// that is different and returns immediately.
Component.updated = function updated (elem, prev) {
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

// Skate
//
// Calls the user-defined updated() lifecycle callback.
Component[$updated] = function _updated (elem) {
  if (typeof this.updated === 'function') {
    const prev = elem[$props];
    elem[$props] = getSetProps(elem);
    return this.updated(elem, prev);
  }
  return true;
};

// Skate
//
// Goes through the user-defined render lifecycle.
Component[$renderer] = function _renderer (elem) {
  if (elem[$rendering] || !elem[$connected]) {
    return;
  }

  // Flag as rendering. This prevents anything from trying to render - or
  // queueing a render - while there is a pending render.
  elem[$rendering] = true;

  const shouldRender = this[$updated](elem);

  // Even though this would ideally be checked in the updated() callback,
  // it may not be, so we ensure that there is a point in proceeding.
  if (!this.render || !this.renderer) {
    elem[$rendering] = false;
    return;
  }

  if (shouldRender) {
    const result = this.renderer({ elem, render: this.render, shadowRoot: getOrAttachShadow(elem) });
    if (typeof this.rendered === 'function') {
      if (result && typeof result.then === 'function') {
        result.then(this.rendered.bind(null, elem));
      } else {
        this.rendered(elem);
      }
    }
  }

  elem[$rendering] = false;
};

Component.prototype = Object.create(HTMLElement.prototype, {
  // v1
  connectedCallback: {
    configurable: true,
    value () {
      callConnected(this);
    }
  },

  // v1
  disconnectedCallback: {
    configurable: true,
    value () {
      callDisconnected(this);
    }
  },

  // v0 and v1
  attributeChangedCallback: {
    configurable: true,
    value (name, oldValue, newValue) {
      const { attributeChanged, observedAttributes } = this.constructor;
      const propertyName = data(this, 'attributeLinks')[name];

      // In V0 we have to ensure the attribute is being observed.
      if (customElementsV0 && observedAttributes.indexOf(name) === -1) {
        return;
      }

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
  },

  // v0
  createdCallback: {
    configurable: true,
    value () {
      callConstructor(this);
    }
  },

  // v0
  attachedCallback: {
    configurable: true,
    value () {
      callConnected(this);
    }
  },

  // v0
  detachedCallback: {
    configurable: true,
    value () {
      callDisconnected(this);
    }
  }
});

export default Component;
