import dashCase from '../util/dash-case';
import data from '../util/data';
import emit from '../api/emit';

function isEmpty (value) {
  return value == null;
}

function property (name, prop) {
  var internalValue;
  let isBoolean = prop.type === Boolean;

  if (typeof prop.init === 'function') {
    internalValue = prop.init();
  } else if (prop.init !== undefined) {
    internalValue = prop.init;
  }

  prop.get = function () {
    return internalValue;
  };

  prop.set = function (value) {
    var info = data(this);

    if (isEmpty(value) && prop.attr && !info.updatingProperty) {
      this.removeAttribute(prop.attr);
      return;
    }

    // If the property is being updated and it is a boolean we must just check
    // if the attribute exists because "" is true for a boolean attribute.
    if (info.updatingProperty && isBoolean) {
      value = this.hasAttribute(prop.attr);
    }

    // We report both new and old values;
    var newValue = prop.type ? prop.type(value) : value;
    var oldValue = internalValue;

    // Don't do anything if the values are the same.
    if (newValue === oldValue) {
      return;
    }

    // We only store the value internally if a getter isn't specified.
    internalValue = newValue;

    // We check first to see if we're already updating the property from
    // the attribute. If we are, then there's no need to update the attribute
    // especially because it would invoke an infinite loop.
    if (prop.attr && !info.updatingProperty) {
      info.updatingAttribute = true;

      if (isBoolean && internalValue) {
        this.setAttribute(prop.attr, '');
      } else if (isEmpty(internalValue) || isBoolean && !internalValue) {
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
    if (prop.update) {
      prop.update.call(this, newValue, oldValue);
    }

    // If we are emitting notify the element of the change.
    if (prop.emit) {
      emit(this, prop.emit, {
        bubbles: false,
        cancelable: false,
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

function defineProperty (elem, name, prop = {}) {
  let initialValue;
  let info = data(elem);

  if (!info.attributeToPropertyMap) {
    info.attributeToPropertyMap = {};
  }

  if (typeof prop === 'function') {
    prop = { type: prop };
  }

  if (prop.attr === true) {
    prop.attr = dashCase(name);
    info.attributeToPropertyMap[prop.attr] = name;
  }

  if (prop.attr && elem.hasAttribute(prop.attr)) {
    initialValue = elem.getAttribute(prop.attr);
  } else {
    initialValue = elem[name];
  }

  if (prop.emit === true) {
    prop.emit = 'skate.property';
  }

  if (initialValue !== undefined) {
    prop.init = initialValue;
  }

  prop = property(name, prop);
  Object.defineProperty(elem, name, prop);
}

export default function (props) {
  Object.keys(props).forEach(name => defineProperty(this, name, props[name]));
}
