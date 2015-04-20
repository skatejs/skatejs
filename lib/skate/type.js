(function (factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "module", "../constants"], factory);
  } else if (typeof exports !== "undefined" && typeof module !== "undefined") {
    factory(exports, module, require("../constants"));
  }
})(function (exports, module, _constants) {
  "use strict";

  var TYPE_ATTRIBUTE = _constants.TYPE_ATTRIBUTE;
  var TYPE_CLASSNAME = _constants.TYPE_CLASSNAME;
  var TYPE_ELEMENT = _constants.TYPE_ELEMENT;
  module.exports = {
    ATTRIBUTE: TYPE_ATTRIBUTE,
    CLASSNAME: TYPE_CLASSNAME,
    ELEMENT: TYPE_ELEMENT
  };
});