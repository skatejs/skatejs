import { render } from 'preact';
import {
  ctorObservedAttributes as $ctorObservedAttributes,
  ctorProps as $ctorProps,
  ctorCreateInitProps as $ctorCreateInitProps,
  props as $props,
  _updateDebounced
} from './util/symbols';
import { createNativePropertyDescriptor } from './lifecycle/props-init';
import createSymbol from './util/create-symbol';
import data from './util/data';
import debounce from './util/debounce';
import getAttrMgr from './util/attributes-manager';
import getPropNamesAndSymbols from './util/get-prop-names-and-symbols';
import getPropsMap from './util/get-props-map';
import getSetProps from './props';
import setCtorNativeProperty from './util/set-ctor-native-property';
import root from './util/root';

const HTMLElement = root.HTMLElement || class {};

const _connected = createSymbol('connected');
const _prevName = createSymbol('prevName');
const _prevOldValue = createSymbol('prevOldValue');
const _prevNewValue = createSymbol('prevNewValue');
const _update = createSymbol('update');
const _updating = createSymbol('updating');

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

      // https://bugs.webkit.org/show_bug.cgi?id=49739
      //
      // When Webkit fixes that bug so that native property accessors can be
      // retrieved, we can move defining the property to the prototype and away
      // from having to do if for every instance as all other browsers support
      // this.
      Object.defineProperty(elem, nameOrSymbol, propDescriptor);
    });
  };
}

export function Raw (Base = HTMLElement) {
  return class extends Base {
    static is = null
    static observedAttributes = []
    attributeChangedCallback () {}
    connectedCallback () {}
    disconnectedCallback () {}
  };
}

export function Props (Base = Raw()) {
  return class extends Base {
    // Returns unique attribute names configured with props and those set on
    // the Component constructor if any.
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

    // Allows custom observedAttributes that get mixed in with the automated
    // ones.
    static set observedAttributes (value) {
      value = Array.isArray(value) ? value : [];
      setCtorNativeProperty(this, 'observedAttributes', value);
    }

    // Automatically mixes in the super class props so the user doesn't have
    // to do that manually.
    static get props () {
      return { ...super.props, ...this[$ctorProps] };
    }

    // Allows setting of props that get mixed in with the super ones.
    static set props (value) {
      setCtorNativeProperty(this, $ctorProps, value);
    }

    constructor () {
      super();
      const { constructor } = this;

      // TODO refactor to not cater to Safari < 10. This means we can depend on
      // built-in property descriptors.
      //
      // Must be defined on constructor and not from a super class.
      if (!constructor.hasOwnProperty($ctorCreateInitProps)) {
        setCtorNativeProperty(constructor, $ctorCreateInitProps, createInitProps(constructor));
      }

      // Set up property lifecycle.
      const propDefsCount = getPropNamesAndSymbols(getPropsMap(constructor)).length;
      if (propDefsCount && constructor[$ctorCreateInitProps]) {
        constructor[$ctorCreateInitProps](this);
      }

      // Bind a debounced updating function to trigger updates in batches.
      this[_updateDebounced] = debounce(this[_update]);
    }

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
    }

    connectedCallback () {
      // Reflect attributes pending values
      getAttrMgr(this).resumeAttributesUpdates();

      // Used to check whether or not the component can render.
      this[_connected] = true;

      // Queue a render.
      this[_updateDebounced]();
    }

    disconnectedCallback () {
      // Suspend updating attributes until re-connected
      getAttrMgr(this).suspendAttributesUpdates();

      // Ensures the component can't be rendered while disconnected.
      this[_connected] = false;
    }

    // Called when props actually change.
    propsChangedCallback () {}

    // Called whenever props are set, even if they don't change.
    propsSetCallback () {}

    // Called to see if the props changed.
    propsUpdatedCallback (next, prev) {
      // The 'previousProps' will be undefined if it is the initial render.
      if (!prev) {
        return true;
      }

      // The 'prevProps' will always contain all of the keys.
      //
      // Use classic loop because:
      //
      // - for ... in skips symbols
      // - for ... of is not working yet with IE!?
      const namesAndSymbols = getPropNamesAndSymbols(prev);
      for (let i = 0; i < namesAndSymbols.length; i++) {
        const nameOrSymbol = namesAndSymbols[i];
        if (prev[nameOrSymbol] !== next[nameOrSymbol]) {
          return true;
        }
      }

      return false;
    }

    // Invokes the complete render lifecycle.
    [_update] = () => {
      if (this[_updating] || !this[_connected]) {
        return;
      }

      // Flag as rendering. This prevents anything from trying to render - or
      // queueing a render - while there is a pending render.
      this[_updating] = true;

      // Prev / next props for prop lifecycle callbacks.
      const prev = this[$props];
      const next = this[$props] = getSetProps(this);

      // Always call set, but only call changed if the props updated.
      this.propsSetCallback(next, prev);
      if (this.propsUpdatedCallback(next, prev)) {
        this.propsChangedCallback(next, prev);
      }

      this[_updating] = false;
    }
  };
}

export function Render (Base = Props()) {
  return class extends Base {
    propsChangedCallback () {
      super.propsChangedCallback();

      if (!this.shadowRoot) {
        this.attachShadow({ mode: 'open' });
      }

      this.rendererCallback(this.shadowRoot, this.renderCallback(this));
      this.renderedCallback();
    }

    // Called to render the component.
    renderCallback () {}

    // Called after the component has rendered.
    renderedCallback () {}

    // Called to render the component.
    rendererCallback () {}
  };
}

export function Component (Base = Render()) {
  return class extends Base {
    rendererCallback (host, vdom) {
      render(vdom, host);
    }
  };
}

export { h } from 'preact';
