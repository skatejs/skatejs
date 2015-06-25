import assignSafe from '../util/assign-safe';
import dashCase from '../util/dash-case';
import data from '../util/data';
import event from './event';
import maybeThis from '../util/maybe-this';
import notify from './notify';

// TODO: Lean out option normalisation.
function property (name, prop) {
  var internalGetter, internalSetter, internalValue, isBoolean;

  if (typeof prop === 'object') {
    prop = assignSafe({}, prop);
  } else {
    prop = { type: prop };
  }

  if (prop.attr === true) {
    prop.attr = dashCase(name);
  }

  if (typeof prop.deps === 'string') {
    prop.deps = [prop.deps];
  }

  if (Array.isArray(prop.deps)) {
    prop.deps = prop.deps.map(name => `skate.property.${name}`);
  }

  if (prop.notify === undefined) {
    prop.notify = true;
  }

  if (typeof prop.type !== 'function') {
    prop.type = val => val;
  }

  prop._value = prop.value;
  delete prop.value;
  if (prop._value !== undefined && typeof prop._value !== 'function') {
    let value = prop._value;
    prop._value = () => value;
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

    // TODO: Should we check at this point to see if it has changed and do
    // nothing if it hasn't? How can we then force-update if we need to?

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
      notify(this, name, {
        newValue: newValue,
        oldValue: oldValue
      });
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

  prop = property(name, prop);
  Object.defineProperty(elem, name, prop);

  // TODO: What happens if the setter does something with a descendant that
  // may not exist yet?
  //
  // Initialise the value if a initial value was provided. Attributes that exist
  // on the element should trump any default values that are provided.
  if (prop._value && (!prop.attr || !elem.hasAttribute(prop.attr))) {
    elem[name] = prop._value.call(elem);
  }

  // This ensures that the corresponding attribute will know to update this
  // property when it is set.
  if (prop.attr) {
    info.attributeToPropertyMap[prop.attr] = name;
  }

  // If you aren't notifying of property changes, then dependencies aren't
  // listened to.
  if (prop.notify) {
    // TODO: Should we be invoking the setter or just notifying that this
    // property changed?
    event(elem, prop.deps, () => elem[name] = elem[name]);
  }
}

function defineProperties (elem, props) {
  Object.keys(props).forEach(function (name) {
    defineProperty(elem, name, props[name]);
  });
}

export default maybeThis(function (elem, props = {}, prop = {}) {
  if (typeof props === 'string') {
    defineProperty(elem, props, prop);
  } else {
    defineProperties(elem, props);
  }
});
