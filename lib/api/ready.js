(function (factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "module"], factory);
  } else if (typeof exports !== "undefined" && typeof module !== "undefined") {
    factory(exports, module);
  }
})(function (exports, module) {
  "use strict";

  module.exports = function (callback) {
    callback = callback.bind(this);
    if (document.readyState === "complete") {
      callback();
    } else {
      document.addEventListener("DOMContentLoaded", callback);
    }
  };
});