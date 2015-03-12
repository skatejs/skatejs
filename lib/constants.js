(function (factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports);
  }
})(function (exports) {
  "use strict";

  var ATTR_IGNORE = exports.ATTR_IGNORE = "data-skate-ignore";
  var TYPE_ATTRIBUTE = exports.TYPE_ATTRIBUTE = "a";
  var TYPE_CLASSNAME = exports.TYPE_CLASSNAME = "c";
  var TYPE_ELEMENT = exports.TYPE_ELEMENT = "t";
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
});