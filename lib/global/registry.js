(function (factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "module", "../types", "./vars", "../util/has-own"], factory);
  } else if (typeof exports !== "undefined" && typeof module !== "undefined") {
    factory(exports, module, require("../types"), require("./vars"), require("../util/has-own"));
  }
})(function (exports, module, _types, _vars, _utilHasOwn) {
  "use strict";

  var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

  var types = _interopRequire(_types);

  var globals = _interopRequire(_vars);

  var hasOwn = _interopRequire(_utilHasOwn);

  var definitions = {};
  var definitionsPerType = {};

  module.exports = globals.registerIfNotExists("registry", {
    get: function get(id) {
      return hasOwn(definitions, id) && definitions[id];
    },
    set: function set(id, opts) {
      if (this.get(id)) {
        throw new Error("A Skate component with the name of \"" + id + "\" already exists.");
      }

      if (!types[opts.type]) {
        throw new Error("Cannot register \"" + id + "\" because there is no registered type for \"" + opts.type + "\". Please make sure you've registered a type handler using skate.type().");
      }

      var type = opts.type;
      definitions[id] = opts;
      definitionsPerType[type] || (definitionsPerType[type] = {});
      definitionsPerType[type][id] = opts;
      return this;
    },
    find: function find(elem) {
      var defs = [];

      // By traversing through the keys of definitionsPerType, we only use the
      // use the types that all our registered components need rather than all
      // registered types. This means if you have element, attribute and class
      // types registered, but you've only registered components that use the
      // element type, you don't incur the overhead of checking against all
      // types.
      for (var type in definitionsPerType) {
        defs = defs.concat(types[type].filter(elem, definitionsPerType[type]) || []);
      }
      return defs;
    }
  });
});