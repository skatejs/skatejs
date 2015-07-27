import assignSafe from '../util/assign-safe';
import dashCase from '../util/dash-case';
import data from '../util/data';

// TODO: Lean out option normalisation.
function property (elem, name, prop) {
  var internalGetter, internalSetter, internalValue, isBoolean;

  // The property definition can be a function which is set as prop.type.
  if (typeof prop === 'object') {
    prop = assignSafe({}, prop);
  } else {
    prop = { type: prop };
  }

  // Normalise prop.attr to a dash-case version of the propertyName.
  if (prop.attr === true) {
    prop.attr = dashCase(name);
  }

  // Normalise prop.type to a function.
  if (typeof prop.type !== 'function') {
    prop.type = val => val;
  }

  // Normalise prop.init as a function bound to the element.
  if (prop.init !== undefined) {
    let value = prop.init;
    prop.init = typeof prop.init === 'function' ? prop.init : () => value;
    prop.init = prop.init.bind(elem);
  }

  internalGetter = prop.get;
  internalSetter = prop.set;
  isBoolean = prop.type && prop.type === Boolean;

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
    var oldValue = this[name];

    // Don't do anything if the values are the same.
    if (newValue === oldValue) {
      return;
    }

    // We only store the value internally if a getter isn't specified.
    if (!internalGetter) {
      internalValue = newValue;
    }

    // We check first to see if we're already updating the property from
    // the attribute. If we are, then there's no need to update the attribute
    // especially because it would invoke an infinite loop.
    if (prop.attr && !info.updatingProperty) {
      info.updatingAttribute = true;

      if (isBoolean && internalValue) {
        this.setAttribute(prop.attr, '');
      } else if (internalValue == null || isBoolean && !internalValue) {
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
  };

  return prop;
}

function defineProperty (elem, name, prop) {
  // We don't need to scope the data to the component ID be cause if multiple
  // bindings on the same component define the same attribute, then they'd
  // conflict anyways.
  var info = data(elem);

  if (!info.attributeToPropertyMap) {
    info.attributeToPropertyMap = {};
  }

  prop = property(elem, name, prop);
  Object.defineProperty(elem, name, prop);

  // This ensures that the corresponding attribute will know to update this
  // property when it is set.
  if (prop.attr) {
    info.attributeToPropertyMap[prop.attr] = name;
  }

  return function () {
    if (prop.attr && elem.hasAttribute(prop.attr)) {
      elem.attributeChangedCallback(prop.attr, null, elem.getAttribute(prop.attr));
    } else if (prop.init) {
      elem[name] = prop.init.call(this);
    }
  };
}

export default function (elem, props) {
  var funcs = Object.keys(props).map(function (name) {
    return defineProperty(elem, name, props[name]);
  });
  return function () {
    funcs.forEach(func => func.call(this));
  };
}
