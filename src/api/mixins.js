import { patchInner } from 'incremental-dom';
import {
  connected as $connected,
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
    static is = ''
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
      return assign({}, super.props, this[$ctorProps]);
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
      // Must be defined on constructor and not from a superclass
      if (!constructor.hasOwnProperty($ctorCreateInitProps)) {
        setCtorNativeProperty(constructor, $ctorCreateInitProps, createInitProps(constructor));
      }

      // Set up property lifecycle.
      const propDefsCount = getPropNamesAndSymbols(getPropsMap(constructor)).length;
      if (propDefsCount && constructor[$ctorCreateInitProps]) {
        constructor[$ctorCreateInitProps](this);
      }

      // Set up a renderer that is debounced for property sets to call directly.
      this[$rendererDebounced] = debounce(this[$renderer].bind(this));
    }

    connectedCallback () {
      // Reflect attributes pending values
      getAttrMgr(this).resumeAttributesUpdates();

      // Used to check whether or not the component can render.
      this[$connected] = true;

      // Render!
      this[$rendererDebounced]();

      // DEPRECATED
      //
      // We can remove this once all browsers support :defined.
      this.setAttribute('defined', '');
    }

    disconnectedCallback () {
      // Suspend updating attributes until re-connected
      getAttrMgr(this).suspendAttributesUpdates();

      // Ensures the component can't be rendered while disconnected.
      this[$connected] = false;
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
  };
}

export function Render (Base = Props()) {
  return class extends Base {
    constructor () {
      super();

      // Set up a renderer that is debounced for property sets to call directly.
      this[$rendererDebounced] = debounce(this[$renderer].bind(this));
    }

    updatedCallback (prevProps) {
      // The 'previousProps' will be undefined if it is the initial render.
      if (!prevProps) {
        return true;
      }

      // The 'prevProps' will always contain all of the keys.
      //
      // Use classic loop because:
      // 'for ... in' skips symbols and 'for ... of' is not working yet with IE!?
      // for (let nameOrSymbol of getPropNamesAndSymbols(previousProps)) {
      const namesAndSymbols = getPropNamesAndSymbols(prevProps);
      for (let i = 0; i < namesAndSymbols.length; i++) {
        const nameOrSymbol = namesAndSymbols[i];

        // With Object.is NaN is equal to NaN
        if (!objectIs(prevProps[nameOrSymbol], this[nameOrSymbol])) {
          return true;
        }
      }

      return false;
    }

    // Invoked after rendering, only if a renderCallback() exists.
    renderedCallback () {}

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

    // Calls the updatedCallback() with previous props.
    [$updated] () {
      const prevProps = this[$props];
      this[$props] = getSetProps(this);
      return this.updatedCallback(prevProps);
    }
  };
}

export function Component (Base = Render()) {
  return class extends Base {
    rendererCallback () {
      if (!this.shadowRoot) {
        this.attachShadow({ mode: 'open' });
      }
      patchInner(this.shadowRoot, () => {
        const possibleFn = this.renderCallback(this);
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
  };
}
