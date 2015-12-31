import assign from 'object-assign';
import dashCase from '../util/dash-case';
import data from '../util/data';
import empty from '../util/empty';

const { removeAttribute, setAttribute } = window.Element.prototype;

function getData (elem, name) {
  return data(elem, `api/property/${name}`);
}

function getDataForAttribute (elem, name) {
  return getData(elem, getData(elem, name).linkedProperty);
}

function getLinkedAttribute (name, attr) {
  return attr === true ? dashCase(name) : attr;
}

function createNativePropertyDefinition (name, opts) {
  let prop = {
    configurable: true,
    enumerable: true
  };
  
  
  // Custom accessor lifecycle functions.

  prop.created = function (elem, initialValue) {
    let info = getData(elem, name);
    info.linkedAttribute = getLinkedAttribute(name, opts.attribute);
    info.opts = opts;
    info.updatingProperty = false;
    
    // Ensure we can get the info from inside the attribute methods.
    getData(elem, info.linkedAttribute).linkedProperty = name;

    if (typeof opts.default === 'function') {
      info.defaultValue = opts.default(elem);
    } else if (!empty(opts.default)) {
      info.defaultValue = opts.default;
    }

    // TODO Refactor to be cleaner.
    //
    // We only override removeAttribute and setAttribute once. This means that
    // if you define 10 properties, they still only get overridden once. For
    // this reason, we must re-get info / opts from within the property methods
    // since the functions aren't recreated for each scope.
    if (info.linkedAttribute) {
      if (!info.attributeMap) {
        info.attributeMap = {};

        elem.removeAttribute = function (attrName) {
          const info = getDataForAttribute(this, attrName);
          
          if (!info.linkedAttribute) {
            return removeAttribute.call(this, attrName);
          }
          
          const prop = info.attributeMap[attrName];
          const serializedValue = info.opts.serialize(info.defaultValue);
          info.updatingAttribute = true;
          
          if (empty(serializedValue)) {
            removeAttribute.call(this, attrName);
          } else {
            setAttribute.call(this, attrName, serializedValue);
          }

          if (prop) {
            elem[prop] = undefined;
          }

          info.updatingAttribute = false;
        };

        elem.setAttribute = function (attrName, attrValue) {
          const info = getDataForAttribute(this, attrName);
          
          if (!info.linkedAttribute) {
            return setAttribute.call(this, attrName, attrValue);
          }
          
          const prop = info.attributeMap[attrName];
          info.updatingAttribute = true;
          setAttribute.call(this, attrName, attrValue);

          if (prop) {
            elem[prop] = info.opts.deserialize(attrValue);
          }

          info.updatingAttribute = false;
        };
      }

      info.attributeMap[info.linkedAttribute] = name;
    }

    // Set up initial value if it wasn't specified.
    if (empty(initialValue)) {
      if (info.linkedAttribute && elem.hasAttribute(info.linkedAttribute)) {
        initialValue = opts.deserialize(elem.getAttribute(info.linkedAttribute));
      } else {
        initialValue = info.defaultValue;
      }
    }

    // We must coerce the initial value just in case it wasn't already.
    info.internalValue = opts.coerce ? opts.coerce(initialValue) : initialValue;

    // User-defined created callback.
    if (typeof opts.created === 'function') {
      opts.created(elem, {
        name,
        value: initialValue
      });
    }
  };
  
  prop.ready = function (elem, initialValue) {
    elem[name] = initialValue;
    if (typeof opts.ready === 'function') {
      opts.ready(elem, {
        name,
        value: initialValue
      });
    }
  };
  
  
  // Native accessor functions.

  prop.get = function () {
    const info = getData(this, name);
    const internalValue = info.internalValue;

    if (opts.get) {
      return opts.get(this, { name, internalValue });
    }

    return internalValue;
  };
  
  prop.init = function () {
    const init = getData(this, name).internalValue;
    this[name] = empty(init) ? this[name] : init;
  };

  prop.set = function (newValue) {
    const info = getData(this, name);
    const oldValue = info.oldValue;

    if (info.updatingProperty) {
      return;
    }

    info.updatingProperty = true;
    
    if (empty(newValue)) {
      newValue = info.defaultValue;
    }

    if (typeof opts.coerce === 'function') {
      newValue = opts.coerce(newValue);
    }

    info.internalValue = newValue;

    if (info.linkedAttribute && !info.updatingAttribute) {
      const serializedValue = opts.serialize(newValue);
      if (empty(serializedValue)) {
        removeAttribute.call(this, info.linkedAttribute);
      } else {
        setAttribute.call(this, info.linkedAttribute, serializedValue);
      }
    }

    if (typeof opts.set === 'function') {
      opts.set(this, { name, newValue, oldValue });
    }

    info.oldValue = newValue;
    info.updatingProperty = false;
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
