import { patchInner } from 'incremental-dom';
import {
  connected as $connected,
  created as $created,
  ctorObservedAttributes as $ctorObservedAttributes,
  ctorProps as $ctorProps,
  ctorCreateInitProps as $ctorCreateInitProps,
  props as $props,
  renderer as $renderer,
  rendererDebounced as $rendererDebounced,
  rendering as $rendering,
  updated as $updated
} from '../util/symbols';
import assign from '../util/assign';
import createSymbol from '../util/create-symbol';
import data from '../util/data';
import debounce from '../util/debounce';
import getAttrMgr from '../util/attributes-manager';
import getOwnPropertyDescriptors from '../util/get-own-property-descriptors';
import getPropNamesAndSymbols from '../util/get-prop-names-and-symbols';
import getPropsMap from '../util/get-props-map';
import getSetProps from './props';
import { createNativePropertyDescriptor } from '../lifecycle/props-init';
import { isFunction } from '../util/is-type';
import objectIs from '../polyfills/object-is';
import setCtorNativeProperty from '../util/set-ctor-native-property';
import root from '../util/root';

const HTMLElement = root.HTMLElement || class {};
const _prevName = createSymbol('prevName');
const _prevOldValue = createSymbol('prevOldValue');
const _prevNewValue = createSymbol('prevNewValue');

// TEMPORARY: Once deprecations in this file are removed, this can be removed.
function deprecated (elem, oldUsage, newUsage) {
  if (process.env.NODE_ENV !== 'production') {
    const ownerName = elem.localName ? elem.localName : String(elem);
    console.warn(`${ownerName} ${oldUsage} is deprecated. Use ${newUsage}.`);
  }
}

function preventDoubleCalling (elem, name, oldValue, newValue) {
  return name === elem[_prevName] &&
    oldValue === elem[_prevOldValue] &&
    newValue === elem[_prevNewValue];
}

// TODO remove when not catering to Safari < 10.
function createNativePropertyDescriptors (Ctor) {
  const propDefs = getPropsMap(Ctor);
  return getPropNamesAndSymbols(propDefs).reduce((propDescriptors, nameOrSymbol) => {
    propDescriptors[nameOrSymbol] = createNativePropertyDescriptor(propDefs[nameOrSymbol]);
    return propDescriptors;
  }, {});
}

// TODO refactor when not catering to Safari < 10.
//
// We should be able to simplify this where all we do is Object.defineProperty().
function createInitProps (Ctor) {
  const propDescriptors = createNativePropertyDescriptors(Ctor);

  return (elem) => {
    getPropNamesAndSymbols(propDescriptors).forEach((nameOrSymbol) => {
      const propDescriptor = propDescriptors[nameOrSymbol];
      propDescriptor.beforeDefineProperty(elem);

      // We check here before defining to see if the prop was specified prior
      // to upgrading.
      const hasPropBeforeUpgrading = nameOrSymbol in elem;

      // This is saved prior to defining so that we can set it after it it was
      // defined prior to upgrading. We don't want to invoke the getter if we
      // don't need to, so we only get the value if we need to re-sync.
      const valueBeforeUpgrading = hasPropBeforeUpgrading && elem[nameOrSymbol];

      // https://bugs.webkit.org/show_bug.cgi?id=49739
      //
      // When Webkit fixes that bug so that native property accessors can be
      // retrieved, we can move defining the property to the prototype and away
      // from having to do if for every instance as all other browsers support
      // this.
      Object.defineProperty(elem, nameOrSymbol, propDescriptor);

      // DEPRECATED
      //
      // We'll be removing get / set callbacks on properties. Use the
      // updatedCallback() instead.
      //
      // We re-set the prop if it was specified prior to upgrading because we
      // need to ensure set() is triggered both in polyfilled environments and
      // in native where the definition may be registerd after elements it
      // represents have already been created.
      if (hasPropBeforeUpgrading) {
        elem[nameOrSymbol] = valueBeforeUpgrading;
      }
    });
  };
}

export default class extends HTMLElement {
  static is = ''

  /**
   * Returns unique attribute names configured with props and
   * those set on the Component constructor if any
   */
  static get observedAttributes () {
    const attrsOnCtor = this.hasOwnProperty($ctorObservedAttributes) ? this[$ctorObservedAttributes] : [];
    const propDefs = getPropsMap(this);

    // Use Object.keys to skips symbol props since they have no linked attributes
    const attrsFromLinkedProps = Object.keys(propDefs).map(propName =>
      propDefs[propName].attrSource).filter(Boolean);

    const all = attrsFromLinkedProps.concat(attrsOnCtor).concat(super.observedAttributes);
    return all.filter((item, index) =>
      all.indexOf(item) === index);
  }

  static set observedAttributes (value) {
    value = Array.isArray(value) ? value : [];
    setCtorNativeProperty(this, 'observedAttributes', value);
  }

  // Returns superclass props overwritten with this Component props
  static get props () {
    return assign({}, super.props, this[$ctorProps]);
  }

  static set props (value) {
    setCtorNativeProperty(this, $ctorProps, value);
  }

  // Passing args is designed to work with document-register-element. It's not
  // necessary for the webcomponents/custom-element polyfill.
  constructor (...args) {
    super(...args);

    const { constructor } = this;

    // Used for the ready() function so it knows when it can call its callback.
    this[$created] = true;

    // TODO refactor to not cater to Safari < 10. This means we can depend on
    // built-in property descriptors.
    // Must be defined on constructor and not from a superclass
    if (!constructor.hasOwnProperty($ctorCreateInitProps)) {
      setCtorNativeProperty(constructor, $ctorCreateInitProps, createInitProps(constructor));
    }

    // Set up a renderer that is debounced for property sets to call directly.
    this[$rendererDebounced] = debounce(this[$renderer].bind(this));

    // Set up property lifecycle.
    const propDefsCount = getPropNamesAndSymbols(getPropsMap(constructor)).length;
    if (propDefsCount && constructor[$ctorCreateInitProps]) {
      constructor[$ctorCreateInitProps](this);
    }

    // DEPRECATED
    //
    // static render()
    // Note that renderCallback is an optional method!
    if (!this.renderCallback && constructor.render) {
      deprecated(this, 'static render', 'renderCallback');
      this.renderCallback = constructor.render.bind(constructor, this);
    }

    // DEPRECATED
    //
    // static created()
    //
    // Props should be set up before calling this.
    const { created } = constructor;
    if (isFunction(created)) {
      deprecated(this, 'static created', 'constructor');
      created(this);
    }

    // DEPRECATED
    //
    // Feature has rarely been used.
    //
    // Created should be set before invoking the ready listeners.
    const elemData = data(this);
    const readyCallbacks = elemData.readyCallbacks;
    if (readyCallbacks) {
      readyCallbacks.forEach(cb => cb(this));
      delete elemData.readyCallbacks;
    }
  }

  // Custom Elements v1
  connectedCallback () {
    // Reflect attributes pending values
    getAttrMgr(this).resumeAttributesUpdates();

    // Used to check whether or not the component can render.
    this[$connected] = true;

    // Render!
    this[$rendererDebounced]();

    // DEPRECATED
    //
    // static attached()
    const { attached } = this.constructor;
    if (isFunction(attached)) {
      deprecated(this, 'static attached', 'connectedCallback');
      attached(this);
    }

    // DEPRECATED
    //
    // We can remove this once all browsers support :defined.
    this.setAttribute('defined', '');
  }

  // Custom Elements v1
  disconnectedCallback () {
    // Suspend updating attributes until re-connected
    getAttrMgr(this).suspendAttributesUpdates();

    // Ensures the component can't be rendered while disconnected.
    this[$connected] = false;

    // DEPRECATED
    //
    // static detached()
    const { detached } = this.constructor;
    if (isFunction(detached)) {
      deprecated(this, 'static detached', 'disconnectedCallback');
      detached(this);
    }
  }

  // Custom Elements v1
  attributeChangedCallback (name, oldValue, newValue) {
    // Polyfill calls this twice.
    if (preventDoubleCalling(this, name, oldValue, newValue)) {
      return;
    }

    // Set data so we can prevent double calling if the polyfill.
    this[_prevName] = name;
    this[_prevOldValue] = oldValue;
    this[_prevNewValue] = newValue;

    const propNameOrSymbol = data(this, 'attrSourceLinks')[name];
    if (propNameOrSymbol) {
      const changedExternally = getAttrMgr(this).onAttributeChanged(name, newValue);
      if (changedExternally) {
        // Sync up the property.
        const propDef = getPropsMap(this.constructor)[propNameOrSymbol];
        const newPropVal = newValue !== null && propDef.deserialize
          ? propDef.deserialize(newValue)
          : newValue;

        const propData = data(this, 'props')[propNameOrSymbol];
        propData.settingPropFromAttrSource = true;
        this[propNameOrSymbol] = newPropVal;
        propData.settingPropFromAttrSource = false;
      }
    }

    // DEPRECATED
    //
    // static attributeChanged()
    const { attributeChanged } = this.constructor;
    if (isFunction(attributeChanged)) {
      deprecated(this, 'static attributeChanged', 'attributeChangedCallback');
      attributeChanged(this, { name, newValue, oldValue });
    }
  }

  // Skate
  updatedCallback (prevProps) {
    if (this.constructor.hasOwnProperty('updated')) {
      deprecated(this, 'static updated', 'updatedCallback');
    }
    return this.constructor.updated(this, prevProps);
  }

  // Skate
  renderedCallback () {
    if (this.constructor.hasOwnProperty('rendered')) {
      deprecated(this, 'static rendered', 'renderedCallback');
    }
    return this.constructor.rendered(this);
  }

  // Skate
  //
  // Maps to the static renderer() callback. That logic should be moved here
  // when that is finally removed.
  // TODO: finalize how to support different rendering strategies.
  rendererCallback () {
    // TODO: cannot move code here because tests expects renderer function to still exist on constructor!
    return this.constructor.renderer(this);
  }

  // Skate
  // @internal
  // Invokes the complete render lifecycle.
  [$renderer] () {
    if (this[$rendering] || !this[$connected]) {
      return;
    }

    // Flag as rendering. This prevents anything from trying to render - or
    // queueing a render - while there is a pending render.
    this[$rendering] = true;
    if (this[$updated]() && isFunction(this.renderCallback)) {
      this.rendererCallback();
      this.renderedCallback();
    }

    this[$rendering] = false;
  }

  // Skate
  // @internal
  // Calls the updatedCallback() with previous props.
  [$updated] () {
    const prevProps = this[$props];
    this[$props] = getSetProps(this);
    return this.updatedCallback(prevProps);
  }

  // Skate
  static extend (definition = {}, Base = this) {
    // Create class for the user.
    class Ctor extends Base {}

    // For inheriting from the object literal.
    const opts = getOwnPropertyDescriptors(definition);
    const prot = getOwnPropertyDescriptors(definition.prototype);

    // Prototype is non configurable (but is writable).
    delete opts.prototype;

    // Pass on static and instance members from the definition.
    Object.defineProperties(Ctor, opts);
    Object.defineProperties(Ctor.prototype, prot);

    return Ctor;
  }

  // Skate
  //
  // DEPRECATED
  //
  // Stubbed in case any subclasses are calling it.
  static rendered () {}

  // Skate
  //
  // DEPRECATED
  //
  // Move this to rendererCallback() before removing.
  static renderer (elem) {
    if (!elem.shadowRoot) {
      elem.attachShadow({ mode: 'open' });
    }
    patchInner(elem.shadowRoot, () => {
      const possibleFn = elem.renderCallback(elem);
      if (isFunction(possibleFn)) {
        possibleFn();
      } else if (Array.isArray(possibleFn)) {
        possibleFn.forEach((fn) => {
          if (isFunction(fn)) {
            fn();
          }
        });
      }
    });
  }

  // Skate
  //
  // DEPRECATED
  //
  // Move this to updatedCallback() before removing.
  static updated (elem, previousProps) {
    // The 'previousProps' will be undefined if it is the initial render.
    if (!previousProps) {
      return true;
    }

    // The 'previousProps' will always contain all of the keys.
    //
    // Use classic loop because:
    // 'for ... in' skips symbols and 'for ... of' is not working yet with IE!?
    // for (let nameOrSymbol of getPropNamesAndSymbols(previousProps)) {
    const namesAndSymbols = getPropNamesAndSymbols(previousProps);
    for (let i = 0; i < namesAndSymbols.length; i++) {
      const nameOrSymbol = namesAndSymbols[i];

      // With Object.is NaN is equal to NaN
      if (!objectIs(previousProps[nameOrSymbol], elem[nameOrSymbol])) {
        return true;
      }
    }

    return false;
  }
}
