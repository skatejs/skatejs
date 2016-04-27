(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["module", "exports"], factory);
  } else if (typeof exports !== "undefined") {
    factory(module, exports);
  } else {
    var mod = {
      exports: {}
    };
    factory(mod, mod.exports);
    global.registry = mod.exports;
  }
})(this, function (module, exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var definitions = {};
  var map = [];
  var types = [];
  var hasOwn = Object.prototype.hasOwnProperty;
  exports.default = {
    get: function get(name) {
      return hasOwn.call(definitions, name) && definitions[name];
    },
    set: function set(name, Ctor) {
      if (this.get(name)) {
        throw new Error("A Skate component with the name of \"" + name + "\" already exists.");
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
      var typesLength = types.length;
      for (var a = 0; a < typesLength; a++) {
        var reduced = types[a].reduce(elem, map[a]);
        if (reduced) {
          return reduced;
        }
      }
    }
  };
  module.exports = exports['default'];
});