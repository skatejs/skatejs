(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['module', 'exports', '../util/data'], factory);
  } else if (typeof exports !== "undefined") {
    factory(module, exports, require('../util/data'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod, mod.exports, global.data);
    global.attribute = mod.exports;
  }
})(this, function (module, exports, _data) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  exports.default = function (opts) {
    var attribute = opts.attribute;

    return function (name, oldValue, newValue) {
      var propertyName = (0, _data2.default)(this, 'attributeLinks')[name];

      if (propertyName) {
        var propertyData = (0, _data2.default)(this, 'api/property/' + propertyName);
        if (!propertyData.settingProperty) {
          var propOpts = this.constructor.properties[propertyName];
          this[propertyName] = newValue !== null && propOpts.deserialize ? propOpts.deserialize(newValue) : newValue;
        }
      }

      if (attribute) {
        attribute(this, {
          name: name,
          newValue: newValue === null ? undefined : newValue,
          oldValue: oldValue === null ? undefined : oldValue
        });
      }
    };
  };

  var _data2 = _interopRequireDefault(_data);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  module.exports = exports['default'];
});