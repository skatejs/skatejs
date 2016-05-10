(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['module', 'exports', './register-element'], factory);
  } else if (typeof exports !== "undefined") {
    factory(module, exports, require('./register-element'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod, mod.exports, global.registerElement);
    global.customElements = mod.exports;
  }
})(this, function (module, exports, _registerElement) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _registerElement2 = _interopRequireDefault(_registerElement);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  var reservedNames = ['annotation-xml', 'color-profile', 'font-face', 'font-face-src', 'font-face-uri', 'font-face-format', 'font-face-name', 'missing-glyph'];
  var customElementCriteria = ['contain at least one dash', 'not start with a dash', 'not be one of: ' + reservedNames.join(', ')];
  var definitions = {};
  exports.default = window.customElements || {
    define: function define(name, Ctor) {
      if (definitions[name]) {
        throw new Error('A Skate component with the name of "' + name + '" already exists.');
      }

      // Screen non-native names and try and be more helpful than native.
      if (name.indexOf('-') < 1 || reservedNames.indexOf(name) > -1) {
        throw new Error(name + ' is not a valid custom element name. A custom element name must: ' + customElementCriteria.map(function (a) {
          return '\n- ' + a;
        }).join(''));
      }

      // Support legacy Blink.
      if (_registerElement2.default) {
        // Blink is picky about options.
        var nativeDefinition = { prototype: Ctor.prototype };

        // Only set extends if the user specified it otherwise Blink complains
        // even if it's null.
        if (Ctor.extends) {
          nativeDefinition.extends = Ctor.extends;
        }

        (0, _registerElement2.default)(name, nativeDefinition);
      }

      // Actually register.
      definitions[name] = Ctor;
    },
    get: function get(name) {
      return definitions[name];
    }
  };
  module.exports = exports['default'];
});