(function (factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "module", "../constants"], factory);
  } else if (typeof exports !== "undefined" && typeof module !== "undefined") {
    factory(exports, module, require("../constants"));
  }
})(function (exports, module, _constants) {
  "use strict";

  var ATTR_IGNORE = _constants.ATTR_IGNORE;

  module.exports = function (element) {
    var attrs = element.attributes;
    return attrs && !!attrs[ATTR_IGNORE];
  };
});