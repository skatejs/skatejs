import {
  connected as $connected,
  rendererDebounced as $rendererDebounced,
} from '../util/symbols';
import assign from '../util/assign';
import data from '../util/data';
import empty from '../util/empty';
import dashCase from '../util/dash-case';

function getDefaultValue(elem, name, opts) {
  return typeof opts.default === 'function' ? opts.default(elem, { name }) : opts.default;
}

function getInitialValue(elem, name, opts) {
  return typeof opts.initial === 'function' ? opts.initial(elem, { name }) : opts.initial;
}

function getPropData(elem, name) {
  const namespace = `api/property/${typeof name === 'symbol' ? String(name) : name}`;
  return data(elem, namespace);
}

function createNativePropertyDefinition(name, opts) {
  const prop = {
    configurable: true,
    enumerable: true,
  };

  prop.created = function created(elem) {
    const propData = getPropData(elem, name);
    const attributeName = opts.attribute === true ? dashCase(name) : opts.attribute;
    let initialValue = elem[name];

    // Store property to attribute link information.
    data(elem, 'attributeLinks')[attributeName] = name;
    data(elem, 'propertyLinks')[name] = attributeName;

    // Set up initial value if it wasn't specified.
    if (empty(initialValue)) {
      if (attributeName && elem.hasAttribute(attributeName)) {
        initialValue = opts.deserialize(elem.getAttribute(attributeName));
      } else if ('initial' in opts) {
        initialValue = getInitialValue(elem, name, opts);
      } else if ('default' in opts) {
        initialValue = getDefaultValue(elem, name, opts);
      }
    }

    propData.internalValue = opts.coerce ? opts.coerce(initialValue) : initialValue;
  };

  prop.get = function get() {
    const propData = getPropData(this, name);
    const { internalValue } = propData;
    return typeof opts.get === 'function' ? opts.get(this, { name, internalValue }) : internalValue;
  };

  prop.set = function set(newValue) {
    // console.log('prop:set', JSON.stringify(newValue), typeof newValue);
    const propData = getPropData(this, name);
    propData.lastAssignedValue = newValue;
    let { oldValue } = propData;
    let shouldRemoveAttribute = false;

    if (empty(oldValue)) {
      oldValue = null;
    }

    if (empty(newValue)) {
      // console.log('Getting default value');
      newValue = getDefaultValue(this, name, opts);
      shouldRemoveAttribute = true;
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
    // console.log('Setting', propData.lastAssignedValue, typeof propData.lastAssignedValue);

    // Link up the attribute.
    if (this[$connected]) {
      // console.log('connected');
      // console.log('set:connected');
      const attributeName = data(this, 'propertyLinks')[name];

      // We only link if there's an attribute and the setting of it didn't trigger this.
      // console.log('LETMEIN', attributeName && !propData.settingAttribute);
      // console.log('shouldRemoveAttribute', shouldRemoveAttribute);
      if (attributeName && !propData.settingAttribute) {
        // console.log(opts.serialize);
        const serializedValue = opts.serialize(newValue);
        // console.log('serializedValue', JSON.stringify(newValue), typeof newValue)
        const currentAttrValue = this.getAttribute(attributeName);
        const serializedIsEmpty = empty(serializedValue);
        const attributeChanged = !(
          (serializedIsEmpty && empty(currentAttrValue)) || serializedValue === currentAttrValue
        );

        propData.syncingAttribute = true;

        // console.log(attributeName, shouldRemoveAttribute || serializedIsEmpty);
        if (shouldRemoveAttribute || serializedIsEmpty) {
          this.removeAttribute(attributeName);
        } else {
          this.setAttribute(attributeName, serializedValue);
        }

        if (!attributeChanged && propData.syncingAttribute) {
          propData.syncingAttribute = false;
        }
      }

      // Allow the attribute to be linked again.
      propData.settingAttribute = false;
    }
  };

  return prop;
}

export default function (opts) {
  opts = opts || {};

  if (typeof opts === 'function') {
    opts = { coerce: opts };
  }

  return name => createNativePropertyDefinition(name, assign({
    default: null,
    deserialize: value => value,
    serialize: value => value,
  }, opts));
}
