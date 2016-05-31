import assign from 'object-assign';
import data from '../util/data';
import debounce from '../util/debounce';
import emit from '../api/emit';
import empty from '../util/empty';

// Symbol() wasn't transpiling properly.
const $debounce = '____debouncedRender';

function getDefaultValue (elem, name, opts) {
  return typeof opts.default === 'function' ? opts.default(elem, { name }) : opts.default;
}

function getInitialValue (elem, name, opts) {
  return typeof opts.initial === 'function' ? opts.initial(elem, { name }) : opts.initial;
}

function syncAttribute (elem, propertyName, attributeName, newValue, opts) {
  if (!attributeName) {
    return;
  }

  const serializedValue = opts.serialize(newValue);

  if (empty(serializedValue)) {
    elem.removeAttribute(attributeName);
  } else {
    elem.setAttribute(attributeName, serializedValue);
  }
}

function createNativePropertyDefinition (name, opts) {
  const prop = {
    configurable: true,
    enumerable: true
  };

  prop.created = function (elem) {
    const propertyData = data(elem, `api/property/${name}`);
    const attributeName = opts.attribute;
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

    // We must coerce the initial value just in case it wasn't already.
    const internalValue = propertyData.internalValue = opts.coerce ? opts.coerce(initialValue) : initialValue;

    // Since the attribute handler sets the property if the property setting
    // didn't invoke the attribute handler, we must ensure the property
    // setter can't be invoked by the setting of the attribute here.
    syncAttribute(elem, name, attributeName, internalValue, opts);
  };

  prop.get = function () {
    const propertyData = data(this, `api/property/${name}`);
    const { internalValue } = propertyData;
    if (typeof opts.get === 'function') {
      return opts.get(this, { name, internalValue });
    }
    return internalValue;
  };

  prop.render = (function () {
    const shouldUpdate = opts.render;
    if (typeof shouldUpdate === 'undefined') {
      return function (elem, data) {
        return data.newValue !== data.oldValue;
      };
    }
    if (typeof shouldUpdate === 'function') {
      return shouldUpdate;
    }
    return function () {
      return !!shouldUpdate;
    };
  }());

  prop.set = function (newValue) {
    const propData = data(this, `api/property/${name}`);

    if (propData.settingProperty) {
      return;
    }

    const attributeName = data(this, 'propertyLinks')[name];
    const { oldValue } = propData;

    propData.settingProperty = true;

    if (empty(newValue)) {
      newValue = getDefaultValue(this, name, opts);
    }

    if (typeof opts.coerce === 'function') {
      newValue = opts.coerce(newValue);
    }

    const propertyHasChanged = newValue !== oldValue;
    if (propertyHasChanged && opts.event) {
      const canceled = !emit(this, String(opts.event), {
        bubbles: false,
        detail: { name, oldValue, newValue }
      });

      if (canceled) {
        propData.settingProperty = false;
        return;
      }
    }

    propData.internalValue = newValue;
    syncAttribute(this, name, attributeName, newValue, opts);

    const changeData = { name, newValue, oldValue };

    if (typeof opts.set === 'function') {
      opts.set(this, changeData);
    }

    // Re-render on property updates if the should-update check passes.
    const hasRenderFn = this.constructor.render;
    if (hasRenderFn && prop.render(this, changeData)) {
      const deb = this[$debounce] || (this[$debounce] = debounce(this.constructor.renderer));
      deb(this);
    }

    propData.settingProperty = false;
    propData.oldValue = newValue;
  };

  return prop;
}

export default function (opts) {
  opts = opts || {};

  if (typeof opts === 'function') {
    opts = { coerce: opts };
  }

  return function (name) {
    return createNativePropertyDefinition(name, assign({
      deserialize: value => value,
      serialize: value => value
    }, opts));
  };
}
