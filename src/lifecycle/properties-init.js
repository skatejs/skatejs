import assign from 'object-assign';
import dashCase from '../util/dash-case';
import data from '../util/data';

// TODO Split apart createNativePropertyDefinition function.

function getLinkedAttribute (name, attr) {
  return attr === true ? dashCase(name) : attr;
}

function createNativePropertyDefinition (name, opts) {
  let prop = {
    configurable: true,
    enumerable: true
  };

  prop.created = function (elem, initialValue) {
    let info = data(elem, `api/property/${name}`);
    info.linkedAttribute = getLinkedAttribute(name, opts.attribute);
    info.removeAttribute = elem.removeAttribute;
    info.setAttribute = elem.setAttribute;
    info.updatingProperty = false;

    if (typeof opts.default === 'function') {
      info.defaultValue = opts.default(elem);
    } else if (opts.default !== undefined) {
      info.defaultValue = opts.default;
    }

    // TODO Refactor
    if (info.linkedAttribute) {
      if (!info.attributeMap) {
        info.attributeMap = {};

        elem.removeAttribute = function (attrName) {
          info.updatingAttribute = true;
          info.removeAttribute.call(this, attrName);

          if (attrName in info.attributeMap) {
            const propertyName = info.attributeMap[attrName];
            elem[propertyName] = undefined;
          }

          info.updatingAttribute = false;
        };

        elem.setAttribute = function (attrName, attrValue) {
          info.updatingAttribute = true;
          info.setAttribute.call(this, attrName, attrValue);

          if (attrName in info.attributeMap) {
            const propertyName = info.attributeMap[attrName];
            attrValue = String(attrValue);
            elem[propertyName] = opts.deserialize(attrValue);
          }

          info.updatingAttribute = false;
        };
      }

      info.attributeMap[info.linkedAttribute] = name;
    }

    if (initialValue === undefined) {
      if (info.linkedAttribute && elem.hasAttribute(info.linkedAttribute)) {
        let attributeValue = elem.getAttribute(info.linkedAttribute);
        initialValue = opts.deserialize(attributeValue);
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
    const info = data(this, `api/property/${name}`);

    if (opts.get) {
      return opts.get(this);
    }

    return info.internalValue;
  };

  prop.set = function (newValue) {
    let info = data(this, `api/property/${name}`);
    let oldValue;

    if (info.updatingProperty) {
      return;
    }

    info.updatingProperty = true;

    if (info.hasBeenSetOnce) {
      oldValue = this[name];
    } else {
      oldValue = undefined;
      info.hasBeenSetOnce = true;
    }

    if (typeof opts.coerce === 'function') {
      newValue = opts.coerce(newValue);
    }

    if (!opts.get) {
      info.internalValue = typeof newValue === 'undefined' ? info.defaultValue : newValue;
    }

    if (info.linkedAttribute && !info.updatingAttribute) {
      let serializedValue = opts.serialize(newValue);
      if (serializedValue === undefined) {
        info.removeAttribute.call(this, info.linkedAttribute);
      } else {
        info.setAttribute.call(this, info.linkedAttribute, serializedValue);
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
