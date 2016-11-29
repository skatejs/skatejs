import {
  connected as $connected,
  rendererDebounced as $rendererDebounced
} from '../util/symbols';
import data from '../util/data';
import empty from '../util/empty';
import getDefaultValue from '../util/get-default-value';
import getInitialValue from '../util/get-initial-value';
import getPropData from '../util/get-prop-data';
import PropDefinition from '../util/prop-definition';
import syncPropToAttr from '../util/sync-prop-to-attr';

export function createNativePropertyDescriptor (opts) {
  const name = opts.name;

  const prop = {
    configurable: true,
    enumerable: true
  };

  prop.created = function created (elem) {
    const propData = getPropData(elem, name);
    const attributeName = opts.attrName;
    let initialValue = elem[name];

    // Store property to attribute link information.
    if (attributeName) {
      data(elem, 'attributeLinks')[attributeName] = name;
    }

    // Set up initial value if it wasn't specified.
    if (empty(initialValue)) {
      if (attributeName && elem.hasAttribute(attributeName)) {
        initialValue = opts.deserialize(elem.getAttribute(attributeName));
      } else if (opts.hasOwnProperty('initial')) {
        initialValue = getInitialValue(elem, opts);
      } else if (opts.hasOwnProperty('default')) {
        initialValue = getDefaultValue(elem, opts);
      }
    }

    propData.internalValue = opts.coerce ? opts.coerce(initialValue) : initialValue;
  };

  prop.get = function get () {
    const propData = getPropData(this, name);
    const { internalValue } = propData;
    return typeof opts.get === 'function' ? opts.get(this, { name, internalValue }) : internalValue;
  };

  prop.set = function set (newValue) {
    const propData = getPropData(this, name);
    propData.lastAssignedValue = newValue;
    let { oldValue } = propData;

    if (empty(oldValue)) {
      // todo: the doc is incorrect:  When the property is initialised, oldValue will always be undefined
      // we probabbly need to update the doc
      oldValue = null;
    }

    if (empty(newValue)) {
      newValue = getDefaultValue(this, opts);
    }

    if (typeof opts.coerce === 'function') {
      newValue = opts.coerce(newValue);
    }

    const changeData = { name, newValue, oldValue };

    if (typeof opts.set === 'function') {
      opts.set(this, changeData);
    }

    // Queue a re-render.
    this[$rendererDebounced](this);

    // Update prop data so we can use it next time.
    propData.internalValue = propData.oldValue = newValue;

    // Link up the attribute.
    if (this[$connected]) {
      syncPropToAttr(this, opts, false);
    }
  };

  return prop;
}

// todo: This is only used from unit tests
export default function (opts) {
  const propDef = new PropDefinition(opts);
  return () => createNativePropertyDescriptor(propDef);
}
