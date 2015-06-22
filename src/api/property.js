import assignSafe from '../util/assign-safe';
import dashCase from '../util/dash-case';
import data from '../util/data';
import emit from './emit';

/* jshint expr: true */
function notify (elem, notifyName, propName, detail = {}) {
  // Notifications must *always* have:
  // - name
  // - newValue
  // - oldValue
  // but may contain other information.
  detail.name = propName;
  detail.newValue === undefined && (detail.newValue = elem[propName]);
  detail.oldValue === undefined && (detail.oldValue = elem[propName]);

  emit(elem, notifyName, {
    bubbles: true,
    cancelable: false,
    detail: detail
  });
}

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
    prop.deps = prop.deps.split(' ');
  }

  if (!Array.isArray(prop.deps)) {
    prop.deps = [];
  }

  if (prop.notify === undefined) {
    prop.notify = true;
  }

  if (prop.notify === true) {
    prop.notify = 'skate.property';
  }

  if (typeof prop.type !== 'function') {
    prop.type = val => val;
  }

  internalGetter = prop.get;
  internalSetter = prop.set;
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
    var oldValue = this[name];

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
      notify(this, prop.notify, name, {
        newValue: newValue,
        oldValue: oldValue
      });
    }
  };

  return prop;
}

function makePropertyHandler (elem, name, depPath, depName) {
  return function (e) {
    if (depName !== e.detail.name) {
      return;
    }

    var target = elem;

    // Resolve the dependency element from the dependecy path. If no path
    // exists, this will continue to be the main element. If the path
    // points to a non-element, then it's a no-op.
    depPath.forEach(function (part) {
      target = elem && elem[part];
    });

    // If the event bubbled, ensure that it doesn't call any handlers for
    // the same property on main element.
    if (elem !== e.target) {
      e.stopImmediatePropagation();
    }

    // Only notify of changes if the main element, or the element matched by
    // the dependency path, matches the target that triggered the event.
    if (target === e.target) {
      // We get and set the property so that logic in the getter and setter
      // get invoked. When the setter is invoked, it automatically notifies
      // any dependencies.
      elem[name] = elem[name];
    }
  };
}

function defineProperty (elem, name, prop) {
  // We don't need to scope the data to the component ID be cause if multiple
  // bindings on the same component define the same attribute, then they'd
  // conflict anyways.
  var info = data(elem);
  var value = prop && prop.value !== 'undefined' ? prop.value : undefined;

  if (!info.attributeToPropertyMap) {
    info.attributeToPropertyMap = {};
  }

  prop = property(name, prop);
  Object.defineProperty(elem, name, prop);

  // Initialise the value if a initial value was provided. Attributes that exist
  // on the element should trump any default values that are provided.
  if (value !== undefined && (!prop.attr || !elem.hasAttribute(prop.attr))) {
    elem[name] = typeof value === 'function' ? value.call(elem) : value;
  }

  // This ensures that the corresponding attribute will know to update this
  // property when it is set.
  if (prop.attr) {
    info.attributeToPropertyMap[prop.attr] = name;
  }

  // If you aren't notifying of property changes, then dependencies aren't
  // listened to.
  if (prop.notify) {
    prop.deps.forEach(function (dep) {
      var depPath = dep.split('.');
      var depName = depPath.pop();
      elem.addEventListener(prop.notify, makePropertyHandler(elem, name, depPath, depName));
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
}
