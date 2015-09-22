import dashCase from '../util/dash-case';
import data from '../util/data';
import emit from '../api/emit';

// TODO Decouple boolean attributes from the Boolean function.
// TODO Split apart createNativePropertyDefinition function.

function getLinkedAttribute (name, attr) {
  return attr === true ? dashCase(name) : attr;
}

function createNativePropertyDefinition (name, opts) {
  let prop = {};

  prop.created = function (elem, initialValue) {
    let info = data(elem, `api/property/${name}`);
    info.internalValue = initialValue;
    info.isBoolean = opts.type === Boolean;
    info.linkedAttribute = getLinkedAttribute(name, opts.attr);
    info.removeAttribute = elem.removeAttribute;
    info.setAttribute = elem.setAttribute;
    info.updatingProperty = false;

    // TODO Refactor
    if (info.linkedAttribute) {
      if (!info.attributeMap) {
        info.attributeMap = {};

        elem.removeAttribute = function (attrName) {
          info.removeAttribute.call(this, attrName);
          if (attrName in info.attributeMap) {
            elem[info.attributeMap[attrName]] = undefined;
          }
        };

        elem.setAttribute = function (attrName, attrValue) {
          info.setAttribute.call(this, attrName, attrValue);
          if (attrName in info.attributeMap) {
            elem[info.attributeMap[attrName]] = attrValue;
          }
        };
      }

      info.attributeMap[info.linkedAttribute] = name;
    }

    if (info.linkedAttribute && elem.hasAttribute(info.linkedAttribute)) {
      info.internalValue = info.isBoolean ? elem.hasAttribute(info.linkedAttribute) : elem.getAttribute(info.linkedAttribute);
    } else if (typeof opts.init === 'function') {
      info.internalValue = opts.init();
    } else if (typeof opts.init !== 'undefined') {
      info.internalValue = opts.init;
    }

    if (opts.type) {
      info.internalValue = opts.type(info.internalValue);
    }
  };

  prop.get = function () {
    let info = data(this, `api/property/${name}`);
    return info.internalValue;
  };

  prop.ready = function (elem, value) {
    if (opts.update) {
      opts.update(elem, {
        name: name,
        newValue: value,
        oldValue: null
      });
    }
  };

  prop.set = function (value) {
    let info = data(this, `api/property/${name}`);

    if (info.updatingProperty) {
      return;
    }

    info.updatingProperty = true;

    let newValue = opts.type ? opts.type(value) : value;
    let oldValue = info.internalValue;
    info.internalValue = newValue;

    if (newValue === oldValue) {
      info.updatingProperty = false;
      return;
    }

    if (info.linkedAttribute) {
      if (info.isBoolean && newValue) {
        info.setAttribute.call(this, info.linkedAttribute, '');
      } else if (value === undefined || info.isBoolean && !newValue) {
        info.removeAttribute.call(this, info.linkedAttribute, '');
      } else {
        info.setAttribute.call(this, info.linkedAttribute, newValue);
      }
    }

    let changeData = {
      name: name,
      newValue: newValue,
      oldValue: oldValue
    };

    if (opts.update) {
      opts.update(this, changeData);
    }

    if (opts.emit) {
      let eventName = opts.emit;

      if (eventName === true) {
        eventName = 'skate.property';
      }

      emit(this, eventName, {
        bubbles: false,
        cancelable: false,
        detail: changeData
      });
    }

    info.updatingProperty = false;
  };

  return prop;
}

export default function (opts) {
  opts = opts || {};

  if (typeof opts === 'function') {
    opts = { type: opts };
  }

  return function (name) {
    return createNativePropertyDefinition(name, opts);
  };
}
