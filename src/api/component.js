//@flow
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
import createSymbol from '../util/create-symbol';
import data from '../util/data';
import debounce from '../util/debounce';
import getAllKeys from '../util/get-all-keys';
import getOwnPropertyDescriptors from '../util/get-own-property-descriptors';
import {
  getPropDefs,
  getPropDefsCount
} from '../util/cached-prop-defs';
import getSetProps from './props';
import {createPropertyDescriptors} from '../lifecycle/props-init';
import prop from '../util/prop';
import syncAttrToProp from '../util/sync-attr-to-prop';
import syncPropToAttr from '../util/sync-prop-to-attr';
import root from 'window-or-global';

const { HTMLElement } = root;
const htmlElementPrototype = HTMLElement ? HTMLElement.prototype : {};


// Prevent double-calling with polyfill.

const $prevName = createSymbol('name');
const $prevOldValue = createSymbol('oldValue');
const $prevNewValue = createSymbol('newValue');

function preventDoubleCalling (elem:any, name:string, oldValue:?string, newValue:?string) {
  return name === elem[$prevName] &&
    oldValue === elem[$prevOldValue] &&
    newValue === elem[$prevNewValue];
}


function syncPropsToAttrs (elem:any) {
  const props:{[k:string|Symbol]:IPropDef} = getPropDefs(elem.constructor);
  getAllKeys(props).forEach((propName:string|Symbol) => {
    syncPropToAttr(elem, props[propName], propName);
  });
}


/**
 * Returns a function that will create all the native properties on an elem instance
 */
//todo: move this function into props-init file
function createPropDescriptorsFunc (Ctor:any):(elem:any) => void {

  const propDescriptors:{[k:string|Symbol]:IPropertyDescriptor} = createPropertyDescriptors(Ctor);
  //console.log('>> createPropDescriptorsFunc propDescriptors:', propDescriptors);

  return (elem:any) => {

    getAllKeys(propDescriptors).forEach((name:any) => {
      const propDescriptor:IPropertyDescriptor = propDescriptors[name];
      propDescriptor.created(elem);

      // We check here before defining to see if the prop was specified prior
      // to upgrading.
      const hasPropBeforeUpgrading:boolean = name in elem;

      // This is saved prior to defining so that we can set it after it it was
      // defined prior to upgrading. We don't want to invoke the getter if we
      // don't need to, so we only get the value if we need to re-sync.
      const valueBeforeUpgrading:any = hasPropBeforeUpgrading && elem[name];

      // https://bugs.webkit.org/show_bug.cgi?id=49739
      //
      // When Webkit fixes that bug so that native property accessors can be
      // retrieved, we can move defining the property to the prototype and away
      // from having to do if for every instance as all other browsers support
      // this.
      Object.defineProperty(elem, name, propDescriptor);

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

function Component (...args:any[]) {

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

  // Create the function to create all the native properties for this class
  if (!constructor.hasOwnProperty($props) && !constructor[$props]) {
    constructor[$props] = createPropDescriptorsFunc(constructor);
  }

  // Set up a renderer that is debounced for property sets to call directly.
  elem[$rendererDebounced] = debounce(elem[$renderer].bind(elem));

  // Set up property lifecycle.
  if (getPropDefsCount(constructor) && constructor[$props]) {
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
      const propDefs:{[k:string|Symbol]:IPropDef} = getPropDefs(this);
      return getAllKeys(propDefs).map(key => {
        return propDefs[key].attrName;
      }).filter(Boolean);
    },
    override: 'observedAttributes'
  }),

  // Skate
  props: prop({ value: {} })
});

// Skate
Component.extend = function extend (definition = {}, Base:any = this) {
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
      this[$connected] = true;

      syncPropsToAttrs(this);

      this[$rendererDebounced]();

      // DEPRECATED static attached()
      const { constructor } = this;
      if (typeof constructor.attached === 'function') {
        constructor.attached(this);
      }

      this.setAttribute('defined', '');
    }
  }),

  // Custom Elements v1
  disconnectedCallback: prop({
    value () {
      this[$connected] = false;

      // DEPRECATED static detached()
      const { constructor } = this;
      if (typeof constructor.detached === 'function') {
        constructor.detached(this);
      }
    }
  }),

  // Custom Elements v1
  attributeChangedCallback: prop({
    value (attrName:string, oldValue:?string, newValue:?string) {

      // Polyfill calls this twice.
      if (preventDoubleCalling(this, attrName, oldValue, newValue)) {
        return;
      }

      // Set data so we can prevent double calling if the polyfill.
      this[$prevName] = attrName;
      this[$prevOldValue] = oldValue;
      this[$prevNewValue] = newValue;

      syncAttrToProp(this, attrName, oldValue, newValue);

      // DEPRECATED static attributeChanged()
      const { constructor } = this;
      if (typeof constructor.attributeChanged === 'function') {
        // note: newValue and oldValue are swapped here for backward compatibility.
        constructor.attributeChanged(this, { attrName, newValue, oldValue });
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
