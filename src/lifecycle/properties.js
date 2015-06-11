import { EVENT_PREFIX } from '../constants';
import dashCase from '../util/dash-case';
import data from '../util/data';
import events from './events';
import notify from '../api/notify';

function returnSingle (elem, name) {
  return function () {
    return elem[name];
  };
}

function returnMultiple (elem, name, selector) {
  return function () {
    return [].slice.call(elem.querySelectorAll(selector)).map(desc => desc[name]);
  };
}

function resolveReturnFunction (elem) {
  return function (name) {
    var parts = name.split(' ');
    return parts[1] ? returnMultiple(elem, parts[0], parts[1]) : returnSingle(elem, name);
  };
}

function property (name, prop) {
  if (typeof prop !== 'object') {
    prop = { type: prop };
  }

  var _attribute = prop.attr;
  var _coerce = prop.type || (val => val);
  var _dependencies = prop.deps || [];
  var _getter = prop.get;
  var _isBoolean = prop.type && prop.type === Boolean;
  var _notify = prop.notify;
  var _setter = prop.set;
  var _value;

  if (_attribute === true) {
    _attribute = dashCase(name);
  }

  return {
    get () {
      return _getter ?
        _getter.apply(this, _dependencies.map(resolveReturnFunction(this))) :
        _value;
    },

    set (value) {
      var info = data(this);
      _value = _coerce(value);

      // We check first to see if we're already updating the property from
      // the attribute. If we are, then there's no need to update the attribute
      // especially because it would invoke an infinite loop.
      if (_attribute && !info.updatingProperty) {
        info.updatingAttribute = true;

        if (_isBoolean && _value) {
          this.setAttribute(_attribute, '');
        } else if (_isBoolean && !_value) {
          this.removeAttribute(_attribute, '');
        } else {
          this.setAttribute(_attribute, _value);
        }

        info.updatingAttribute = false;
      }

      if (_setter) {
        _setter.call(this, _value);
      }

      if (_notify) {
        notify(this, name);
      }
    }
  };
}

export default function (elem, props = {}) {
  var attributeToPropertyMap = data(elem).attributeToPropertyMap = {};

  Object.keys(props).forEach(function (name) {
    var prop = props[name];

    if (!prop) {
      return;
    }

    Object.defineProperty(elem, name, property(name, prop));

    if (prop.attr) {
      attributeToPropertyMap[dashCase(name)] = name;
    }

    if (typeof prop.value === 'function') {
      elem[name] = prop.value();
    } else if (typeof prop.value !== 'undefined') {
      elem[name] = prop.value;
    }

    events(elem, (prop.deps || []).reduce(function (prev, curr) {
      prev[EVENT_PREFIX + curr] = notify.bind(null, elem, name);
      return prev;
    }, {}));
  });
}
