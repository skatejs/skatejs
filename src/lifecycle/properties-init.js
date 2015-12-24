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

  prop.created = function (elem, initialValue) {
    let info = getData(elem, name);
    info.linkedAttribute = getLinkedAttribute(name, opts.attribute);
    info.updatingProperty = false;
    
    // Ensure we can get the info from inside the attribute methods.
    getData(elem, info.linkedAttribute).linkedProperty = name;

    if (typeof opts.default === 'function') {
      info.defaultValue = opts.default(elem);
    } else if (!empty(opts.default)) {
      info.defaultValue = opts.default;
    }
    
    const defaultValue = info.defaultValue;
    const defaultValueIsEmpty = empty(defaultValue);

    // TODO Refactor to be cleaner.
    if (info.linkedAttribute) {
      if (!info.attributeMap) {
        info.attributeMap = {};

        elem.removeAttribute = function (attrName) {
          const info = getDataForAttribute(this, attrName);
          
          if (!info.linkedAttribute) {
            return removeAttribute.call(this, attrName);
          }
          
          const prop = info.attributeMap[attrName];
          info.updatingAttribute = true;

          if (defaultValueIsEmpty) {
            removeAttribute.call(this, attrName);
          } else {
            setAttribute.call(this, attrName, opts.serialize(defaultValue));
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
            elem[prop] = opts.deserialize(attrValue);
          }

          info.updatingAttribute = false;
        };
      }

      info.attributeMap[info.linkedAttribute] = name;
    }

    if (empty(initialValue)) {
      if (info.linkedAttribute && elem.hasAttribute(info.linkedAttribute)) {
        initialValue = opts.deserialize(elem.getAttribute(info.linkedAttribute));
      } else {
        initialValue = info.defaultValue;
      }
    }

    info.internalValue = initialValue;

    if (typeof opts.created === 'function') {
      opts.created(elem, initialValue);
    }
  };

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
    let oldValue;

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

    let changeData = {
      name: name,
      newValue: newValue,
      oldValue: oldValue
    };

    if (typeof opts.set === 'function') {
      opts.set(this, changeData);
    }

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
