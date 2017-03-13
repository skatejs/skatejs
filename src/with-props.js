import { withRaw } from './with-raw';
import {
  ctorObservedAttributes as $ctorObservedAttributes,
  ctorProps as $ctorProps,
  ctorCreateInitProps as $ctorCreateInitProps,
  props as $props,
  _updateDebounced
} from './util/symbols';
import assign from './util/assign';
import createSymbol from './util/create-symbol';
import data from './util/data';
import debounce from './util/debounce';
import empty from './util/empty';
import getAttrMgr from './util/attributes-manager';
import getPropNamesAndSymbols from './util/get-prop-names-and-symbols';
import getPropsMap from './util/get-props-map';
import setCtorNativeProperty from './util/set-ctor-native-property';
import toNullOrString from './util/to-null-or-string';

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

function getDefaultValue (elem, propDef) {
  return typeof propDef.default === 'function'
    ? propDef.default(elem, { name: propDef.nameOrSymbol })
    : propDef.default;
}

function getPropData (elem, name) {
  const elemData = data(elem, 'props');
  return elemData[name] || (elemData[name] = {});
}

function createNativePropertyDescriptor (propDef) {
  const { nameOrSymbol } = propDef;

  const prop = {
    configurable: true,
    enumerable: true
  };

  prop.beforeDefineProperty = elem => {
    const propData = getPropData(elem, nameOrSymbol);
    const attrSource = propDef.attrSource;

    // Store attrSource name to property link.
    if (attrSource) {
      data(elem, 'attrSourceLinks')[attrSource] = nameOrSymbol;
    }

    // prop value before upgrading
    let initialValue = elem[nameOrSymbol];

    // Set up initial value if it wasn't specified.
    let valueFromAttrSource = false;
    if (empty(initialValue)) {
      if (attrSource && elem.hasAttribute(attrSource)) {
        valueFromAttrSource = true;
        initialValue = propDef.deserialize(elem.getAttribute(attrSource));
      } else {
        initialValue = getDefaultValue(elem, propDef);
      }
    }

    initialValue = propDef.coerce(initialValue);

    propData.internalValue = initialValue;

    // Reflect to Target Attribute
    const mustReflect = propDef.attrTarget && !empty(initialValue) &&
      (!valueFromAttrSource || propDef.attrTargetIsNotSource);

    if (mustReflect) {
      let serializedValue = propDef.serialize(initialValue);
      getAttrMgr(elem).setAttrValue(propDef.attrTarget, serializedValue);
    }
  };

  prop.get = function get () {
    return getPropData(this, nameOrSymbol).internalValue;
  };

  prop.set = function set (newValue) {
    const propData = getPropData(this, nameOrSymbol);
    const useDefaultValue = empty(newValue);

    if (useDefaultValue) {
      newValue = getDefaultValue(this, propDef);
    }

    newValue = propDef.coerce(newValue);

    // Queue a re-render.
    this[_updateDebounced]();

    // Update prop data so we can use it next time.
    propData.internalValue = newValue;

    // Reflect to Target attribute.
    const mustReflect = propDef.attrTarget &&
      (propDef.attrTargetIsNotSource || !propData.settingPropFromAttrSource);
    if (mustReflect) {
      // Note: setting the prop to empty implies the default value
      // and therefore no attribute should be present!
      let serializedValue = useDefaultValue ? null : propDef.serialize(newValue);
      getAttrMgr(this).setAttrValue(propDef.attrTarget, serializedValue);
    }
  };

  return prop;
}

export function withProps (Base = withRaw()) {
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
      const next = this[$props] = getProps(this);

      // Always call set, but only call changed if the props updated.
      this.propsSetCallback(next, prev);
      if (this.propsUpdatedCallback(next, prev)) {
        this.propsChangedCallback(next, prev);
      }

      this[_updating] = false;
    }
  };
}

const freeze = Object.freeze;
const attribute = freeze({ source: true });
const parseIfNotEmpty = val => (empty(val) ? null : JSON.parse(val));
const zeroIfEmptyOrNumberIncludesNaN = val => (empty(val) ? 0 : Number(val));
const sharedFrozenArray = Object.freeze([]);
const sharedFrozenObject = Object.freeze({});

export const propArray = freeze({
  attribute,
  coerce: val => (Array.isArray(val) ? val : (empty(val) ? null : [val])),
  default: () => sharedFrozenArray,
  deserialize: parseIfNotEmpty,
  serialize: JSON.stringify
});

export const propBoolean = freeze({
  attribute,
  coerce: val => !!val,
  default: false,
  deserialize: val => !(val === null),
  serialize: val => (val ? '' : null)
});

export const propNumber = freeze({
  attribute,
  default: 0,
  coerce: zeroIfEmptyOrNumberIncludesNaN,
  deserialize: zeroIfEmptyOrNumberIncludesNaN,
  serialize: toNullOrString
});

export const propObject = freeze({
  attribute,
  default: () => sharedFrozenObject,
  deserialize: parseIfNotEmpty,
  serialize: JSON.stringify
});

export const propString = freeze({
  attribute,
  default: '',
  coerce: toNullOrString,
  deserialize: toNullOrString,
  serialize: toNullOrString
});

export function getProps (elem) {
  const props = {};

  getPropNamesAndSymbols(getPropsMap(elem.constructor)).forEach((nameOrSymbol) => {
    props[nameOrSymbol] = elem[nameOrSymbol];
  });

  return props;
}

export function setProps (elem, props) {
  assign(elem, props);
}
