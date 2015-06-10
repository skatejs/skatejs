(function (global, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['exports', 'module', '../util/dash-case', './notify'], factory);
  } else if (typeof exports !== 'undefined' && typeof module !== 'undefined') {
    factory(exports, module, require('../util/dash-case'), require('./notify'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, mod, global.dashCase, global.notify);
    global.unknown = mod.exports;
  }
})(this, function (exports, module, _utilDashCase, _notify2) {
  'use strict';

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  var _dashCase = _interopRequireDefault(_utilDashCase);

  var _notify3 = _interopRequireDefault(_notify2);

  module.exports = function (name, prop) {
    if (typeof prop !== 'object') {
      prop = { type: prop };
    }

    var _attribute = prop.attr;
    var _coerce = prop.type || function (val) {
      return val;
    };
    var _dependencies = prop.deps || [];
    var _getter = prop.get;
    var _isBoolean = prop.type && prop.type === Boolean;
    var _notify = prop.notify;
    var _setter = prop.set;
    var _value;

    if (_attribute === true) {
      _attribute = (0, _dashCase['default'])(name);
    }

    return {
      get: function get() {
        var _this = this;

        if (_getter) {
          return _getter.apply(this, _dependencies.map(function (dep) {
            return _this[dep];
          }));
        }

        if (_attribute) {
          return _isBoolean ? this.hasAttribute(_attribute) : _coerce(this.getAttribute(_attribute));
        }

        return _value;
      },

      set: function set(value) {
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
          (0, _notify3['default'])(this, name);
        }
      }
    };
  };
});