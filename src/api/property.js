import apiEmit from '../api/emit';
import apiEvent from '../api/event';
import dashCase from '../util/dash-case';
import data from '../util/data';

function property (name, prop) {
  var internalGetter, internalSetter, internalValue, isBoolean;

  if (typeof prop !== 'object') {
    prop = { type: prop };
  }

  if (prop.attr === true) {
    prop.attr = dashCase(name);
  }

  if (typeof prop.deps === 'string') {
    prop.deps = prop.deps.split(' ');
  }

  if (!Array.isArray(prop.deps)) {
    prop.deps = [];
  }

  if (typeof prop.type !== 'function') {
    prop.type = val => val;
  }

  internalGetter = prop.get;
  internalSetter = prop.set;
  internalValue = typeof prop.value === 'function' ? prop.value.call(this) : prop.value;
  isBoolean = prop.type && prop.type === Boolean;
  delete prop.value;

  prop.get = function () {
    return internalGetter ? internalGetter.apply(this) : internalValue;
  };

  prop.set = function (value) {
    var info = data(this);

    // If the property is being updated and it is a boolean we must just check
    // if the attribute exists because "" is true for a boolean attribute.
    if (info.updatingProperty && isBoolean) {
      value = this.hasAttribute(prop.attr);
    }

    // We report both new and old values;
    var newValue = prop.type(value);
    var oldValue = internalValue;

    // We do nothing if the value hasn't changed.
    if (oldValue === newValue) {
      return;
    }

    // Regardless of any options, we store the value internally.
    internalValue = newValue;

    // We check first to see if we're already updating the property from
    // the attribute. If we are, then there's no need to update the attribute
    // especially because it would invoke an infinite loop.
    if (prop.attr && !info.updatingProperty) {
      info.updatingAttribute = true;

      if (isBoolean && internalValue) {
        this.setAttribute(prop.attr, '');
      } else if (isBoolean && !internalValue) {
        this.removeAttribute(prop.attr, '');
      } else {
        this.setAttribute(prop.attr, internalValue);
      }

      info.updatingAttribute = false;
    }

    // A setter is responsible for setting its own value. We still store the
    // value internally because the default getter may still be used to return
    // that value. Even if it's not, we use it to reference the old value which
    // is useful information for the setter.
    if (internalSetter) {
      internalSetter.call(this, newValue, oldValue);
    }

    if (prop.notify) {
      apiEmit(this, prop.notify, {
        detail: {
          name: name,
          newValue: newValue,
          oldValue: oldValue
        }
      });
    }
  };

  return prop;
}

function defineProperty (elem, name, prop) {
  var attributeToPropertyMap = data(elem).attributeToPropertyMap = {};
  prop = property(name, prop);
  Object.defineProperty(elem, name, prop);

  if (prop.attr) {
    attributeToPropertyMap[dashCase(name)] = name;
  }

  if (typeof prop.value === 'function') {
    elem[name] = prop.value();
  } else if (typeof prop.value !== 'undefined') {
    elem[name] = prop.value;
  }

  // If you aren't notifying of property changes, then dependencies aren't
  // listened to.
  if (prop.notify) {
    prop.deps.forEach(function (dep) {
      apiEvent(elem, dep, apiEmit.bind(null, elem, prop.notify));
    });
  }
}

function defineProperties (elem, props) {
  Object.keys(props).forEach(function (name) {
    defineProperty(elem, name, props[name]);
  });
}

export default function (elem, props = {}, prop = {}) {
  if (typeof props === 'string') {
    defineProperty(elem, props, prop);
  } else {
    defineProperties(elem, props);
  }

  return this;
}
