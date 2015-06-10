import dashCase from '../util/dash-case';
import notify from './notify';

export default function (name, prop) {
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
      if (_getter) {
        return _getter.apply(this, _dependencies.map(dep => this[dep]));
      }

      if (_attribute) {
        return _isBoolean ?
          this.hasAttribute(_attribute) :
          _coerce(this.getAttribute(_attribute));
      }

      return _value;
    },

    set (value) {
      _value = _coerce(value);

      if (_attribute) {
        if (_isBoolean && _value) {
          this.setAttribute(_attribute, '');
        } else if (_isBoolean && !_value) {
          this.removeAttribute(_attribute, '');
        } else {
          this.setAttribute(_attribute, _value);
        }
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
