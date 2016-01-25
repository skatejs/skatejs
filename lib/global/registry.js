(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['exports', './vars'], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require('./vars'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.vars);
    global.registry = mod.exports;
  }
})(this, function (exports, _vars) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _vars2 = _interopRequireDefault(_vars);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  var definitions = {};
  var map = [];
  var types = [];
  exports.default = _vars2.default.registerIfNotExists('registry', {
    get: function get(name) {
      return Object.prototype.hasOwnProperty.call(definitions, name) && definitions[name];
    },
    set: function set(name, Ctor) {
      if (this.get(name)) {
        throw new Error('A Skate component with the name of "' + name + '" already exists.');
      }

      var type = Ctor.type;
      var typeIndex = types.indexOf(type);

      if (typeIndex === -1) {
        typeIndex = types.length;
        types.push(type);
        map[typeIndex] = {};
      }

      return definitions[name] = map[typeIndex][name] = Ctor;
    },
    find: function find(elem) {
      var filtered = [];
      var typesLength = types.length;
      for (var a = 0; a < typesLength; a++) {
        filtered = filtered.concat(types[a].filter(elem, map[a]) || []);
      }
      return filtered;
    }
  });
});