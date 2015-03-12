(function (factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "module"], factory);
  } else if (typeof exports !== "undefined" && typeof module !== "undefined") {
    factory(exports, module);
  }
})(function (exports, module) {
  "use strict";

  if (!window.__skate) {
    window.__skate = {
      observer: undefined,
      registry: {}
    };
  }

  module.exports = window.__skate;
});