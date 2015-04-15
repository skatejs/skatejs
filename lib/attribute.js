(function (factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "module"], factory);
  } else if (typeof exports !== "undefined" && typeof module !== "undefined") {
    factory(exports, module);
  }
})(function (exports, module) {
  "use strict";

  module.exports = function (options) {
    return function (name, oldValue, newValue) {
      var callback;
      var type;
      var newValueIsString = typeof newValue === "string";
      var oldValueIsString = typeof oldValue === "string";
      var attrs = options.attributes;
      var specific = attrs && attrs[name];

      if (!oldValueIsString && newValueIsString) {
        type = "created";
      } else if (oldValueIsString && newValueIsString) {
        type = "updated";
      } else if (oldValueIsString && !newValueIsString) {
        type = "removed";
      }

      if (specific && typeof specific[type] === "function") {
        callback = specific[type];
      } else if (specific && typeof specific.fallback === "function") {
        callback = specific.fallback;
      } else if (typeof specific === "function") {
        callback = specific;
      } else if (typeof attrs === "function") {
        callback = attrs;
      }

      // Ensure values are null if undefined.
      newValue = newValue === undefined ? null : newValue;
      oldValue = oldValue === undefined ? null : oldValue;

      // There may still not be a callback.
      if (callback) {
        callback(this, {
          type: type,
          name: name,
          newValue: newValue,
          oldValue: oldValue
        });
      }
    };
  };
});