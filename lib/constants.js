(function (factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports);
  }
})(function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  "use strict";

  var ATTR_IGNORE = "data-skate-ignore";
  exports.ATTR_IGNORE = ATTR_IGNORE;
  var TYPE_ATTRIBUTE = "a";
  exports.TYPE_ATTRIBUTE = TYPE_ATTRIBUTE;
  var TYPE_CLASSNAME = "c";
  exports.TYPE_CLASSNAME = TYPE_CLASSNAME;
  var TYPE_ELEMENT = "t";
  exports.TYPE_ELEMENT = TYPE_ELEMENT;
});