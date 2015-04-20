(function (factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "module"], factory);
  } else if (typeof exports !== "undefined" && typeof module !== "undefined") {
    factory(exports, module);
  }
})(function (exports, module) {
  "use strict";

  var previousSkate = window.skate;

  module.exports = function () {
    window.skate = previousSkate;
    return this;
  };
});