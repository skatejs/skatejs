(function (factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "module", "./ignored"], factory);
  } else if (typeof exports !== "undefined" && typeof module !== "undefined") {
    factory(exports, module, require("./ignored"));
  }
})(function (exports, module, _ignored) {
  "use strict";

  var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

  var ignored = _interopRequire(_ignored);

  function walk(elem, fn, filter) {
    if (elem.nodeType !== 1 || ignored(elem) || filter && filter(elem) === false) {
      return;
    }

    var chren = elem.childNodes;
    var child = chren && chren[0];

    fn(elem);
    while (child) {
      walk(child, fn, filter);
      child = child.nextSibling;
    }
  }

  module.exports = function (elems, fn, filter) {
    if (elems.length === undefined) {
      elems = [elems];
    }

    for (var a = 0; a < elems.length; a++) {
      walk(elems[a], fn, filter);
    }
  };
});