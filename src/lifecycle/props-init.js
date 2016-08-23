import {
  rendererDebounced as $rendererDebounced,
  rendering as $rendering,
} from '../util/symbols';
import assign from '../util/assign';
import data from '../util/data';
import empty from '../util/empty';

function getDefaultValue(elem, name, opts) {
  return typeof opts.default === 'function' ? opts.default(elem, { name }) : opts.default;
}

function getInitialValue(elem, name, opts) {
  return typeof opts.initial === 'function' ? opts.initial(elem, { name }) : opts.initial;
}

function createNativePropertyDefinition(name, opts) {
  const prop = {
    configurable: true,
    enumerable: true,
  };

  prop.created = function (elem) { // eslint-disable-line func-names
    const propData = data(elem, `api/property/${name}`);
    const attributeName = opts.attribute;
    let initialValue = elem[name];
    let shouldSyncAttribute = false;

    // Store property to attribute link information.
    data(elem, 'attributeLinks')[attributeName] = name;
    data(elem, 'propertyLinks')[name] = attributeName;

    // Set up initial value if it wasn't specified.
    if (empty(initialValue)) {
      if (attributeName && elem.hasAttribute(attributeName)) {
        initialValue = opts.deserialize(elem.getAttribute(attributeName));
      } else if ('initial' in opts) {
        initialValue = getInitialValue(elem, name, opts);
        shouldSyncAttribute = true;
      } else if ('default' in opts) {
        initialValue = getDefaultValue(elem, name, opts);
      }
    }

    if (shouldSyncAttribute) {
      prop.set.call(elem, initialValue);
    } else {
      propData.internalValue = opts.coerce ? opts.coerce(initialValue) : initialValue;
    }
  };

  prop.get = function () { // eslint-disable-line func-names
    const propData = data(this, `api/property/${name}`);
    const { internalValue } = propData;
    if (typeof opts.get === 'function') {
      return opts.get(this, { name, internalValue });
    }
    return internalValue;
  };

  prop.set = function (newValue) { // eslint-disable-line func-names
    const propData = data(this, `api/property/${name}`);
    let { oldValue } = propData;
    let shouldRemoveAttribute = false;

    if (empty(oldValue)) {
      oldValue = null;
    }

    if (empty(newValue)) {
      newValue = getDefaultValue(this, name, opts);
      shouldRemoveAttribute = true;
    }

    if (typeof opts.coerce === 'function') {
      newValue = opts.coerce(newValue);
    }

    propData.internalValue = newValue;

    const changeData = { name, newValue, oldValue };

    if (typeof opts.set === 'function') {
      opts.set(this, changeData);
    }

    // Queue a re-render only if it's not currently rendering.
    if (!this[$rendering]) {
      this[$rendererDebounced](this);
    }

    propData.oldValue = newValue;

    // Link up the attribute.
    const attributeName = data(this, 'propertyLinks')[name];
    if (attributeName && !propData.settingAttribute) {
      const serializedValue = opts.serialize(newValue);
      const currentAttrValue = this.getAttribute(attributeName);
      const attributeChanged = !((empty(serializedValue) && empty(currentAttrValue)) ||
                                (serializedValue === currentAttrValue));
      propData.syncingAttribute = true;
      if (shouldRemoveAttribute || empty(serializedValue)) {
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
  };

  return prop;
}

export default function (opts) {
  opts = opts || {};

  if (typeof opts === 'function') {
    opts = { coerce: opts };
  }

  return (name) => createNativePropertyDefinition(name, assign({
    default: null,
    deserialize: value => value,
    serialize: value => value,
  }, opts));
}
