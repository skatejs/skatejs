import { patchInner } from 'incremental-dom';
import {
  connected as $connected,
  created as $created,
  props as $props,
  renderer as $renderer,
  rendererDebounced as $rendererDebounced,
  rendering as $rendering,
  updated as $updated
} from '../util/symbols';
import data from '../util/data';
import dashCase from '../util/dash-case';
import debounce from '../util/debounce';
import getAllKeys from '../util/get-all-keys';
import getOwnPropertyDescriptors from '../util/get-own-property-descriptors';
import getSetProps from './props';
import initProps from '../lifecycle/props-init';
import prop from '../util/prop';
import syncPropToAttr from '../util/sync-prop-to-attr';
import root from 'window-or-global';

const { HTMLElement } = root;
const htmlElementPrototype = HTMLElement ? HTMLElement.prototype : {};

function syncPropsToAttrs (elem) {
  const props = elem.constructor.props;
  Object.keys(props).forEach((propName) => {
    const prop = props[propName];
    syncPropToAttr(elem, prop, propName, true);
  });
}

// Ensures that definitions passed as part of the constructor are functions
// that return property definitions used on the element.
function ensurePropertyFunctions (Ctor) {
  const props = Ctor.props;

  return getAllKeys(props).reduce((descriptors, descriptorName) => {
    descriptors[descriptorName] = props[descriptorName];
    if (typeof descriptors[descriptorName] !== 'function') {
      descriptors[descriptorName] = initProps(descriptors[descriptorName]);
    }
    return descriptors;
  }, {});
}

// Ensures the property definitions are transformed to objects that can be used
// to create properties on the element.
function ensurePropertyDefinitions (Ctor) {
  const props = ensurePropertyFunctions(Ctor);
  return getAllKeys(props).reduce((descriptors, descriptorName) => {
    descriptors[descriptorName] = props[descriptorName](descriptorName);
    return descriptors;
  }, {});
}

function createInitProps (Ctor) {
  const props = ensurePropertyDefinitions(Ctor);

  return (elem) => {
    if (!props) {
      return;
    }

    getAllKeys(props).forEach((name) => {
      const prop = props[name];
      prop.created(elem);

      // We check here before defining to see if the prop was specified prior
      // to upgrading.
      const hasPropBeforeUpgrading = name in elem;

      // This is saved prior to defining so that we can set it after it it was
      // defined prior to upgrading. We don't want to invoke the getter if we
      // don't need to, so we only get the value if we need to re-sync.
      const valueBeforeUpgrading = hasPropBeforeUpgrading && elem[name];

      // https://bugs.webkit.org/show_bug.cgi?id=49739
      //
      // When Webkit fixes that bug so that native property accessors can be
      // retrieved, we can move defining the property to the prototype and away
      // from having to do if for every instance as all other browsers support
      // this.
      Object.defineProperty(elem, name, prop);

      // We re-set the prop if it was specified prior to upgrading because we
      // need to ensure set() is triggered both in polyfilled environments and
      // in native where the definition may be registerd after elements it
      // represents have already been created.
      if (hasPropBeforeUpgrading) {
        elem[name] = valueBeforeUpgrading;
      }
    });
  };
}

function Component (...args) {
  const elem = typeof Reflect === 'object'
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

  if (!constructor[$props]) {
    constructor[$props] = createInitProps(constructor);
  }

  // Set up a renderer that is debounced for property sets to call directly.
  elem[$rendererDebounced] = debounce(elem[$renderer].bind(elem));

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

Object.defineProperties(Component, {
  // Custom Elements v1
  observedAttributes: prop({
    get () {
      const { props } = this;
      return Object.keys(props).map(key => {
        const { attribute } = props[key];
        return attribute === true ? dashCase(key) : attribute;
      }).filter(Boolean);
    },
    override: 'observedAttributes'
  }),

  // Skate
  props: prop({ value: {} })
});

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
// DEPRECATED
//
// Move this to rendererCallback() before removing.
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

// Skate
//
// DEPRECATED
//
// Move this to rendererCallback() before removing.
Component.rendered = function _rendered () {};

// Skate
//
// DEPRECATED
//
// Move this to rendererCallback() before removing.
Component.renderer = function _renderer (elem) {
  if (!elem.shadowRoot) {
    elem.attachShadow({ mode: 'open' });
  }
  patchInner(elem.shadowRoot, () => {
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

Component.prototype = Object.create(htmlElementPrototype, {
  // Custom Elements v1
  connectedCallback: prop({
    value () {
      const { constructor } = this;

      syncPropsToAttrs(this);

      this[$connected] = true;
      this[$rendererDebounced]();

      // DEPRECATED static attached()
      if (typeof constructor.attached === 'function') {
        constructor.attached(this);
      }

      this.setAttribute('defined', '');
    }
  }),

  // Custom Elements v1
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

  // Custom Elements v1
  attributeChangedCallback: prop({
    value (name, oldValue, newValue) {
      const { attributeChanged } = this.constructor;
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
  // Maps to the static updated() callback. That logic should be moved here
  // when that is finally removed.
  updatedCallback: prop({
    value (prev) {
      return this.constructor.updated(this, prev);
    }
  }),

  // Skate
  //
  // Maps to the static render() callback. That logic should be moved here
  // when that is finally removed.
  renderCallback: prop({
    value: null
  }),

  // Skate
  //
  // Maps to the static rendered() callback. That logic should be moved here
  // when that is finally removed.
  renderedCallback: prop({
    value () {
      return this.constructor.rendered(this);
    }
  }),

  // Skate
  //
  // Maps to the static renderer() callback. That logic should be moved here
  // when that is finally removed.
  rendererCallback: prop({
    value () {
      return this.constructor.renderer(this);
    }
  }),

  // Skate
  //
  // Invokes the complete render lifecycle.
  [$renderer]: prop({
    value () {
      if (this[$rendering] || !this[$connected]) {
        return;
      }

      // Flag as rendering. This prevents anything from trying to render - or
      // queueing a render - while there is a pending render.
      this[$rendering] = true;

      if (this[$updated]() && typeof this.renderCallback === 'function') {
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
