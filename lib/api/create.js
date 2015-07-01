(function (factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "module", "../util/assign", "./init", "../global/registry"], factory);
  } else if (typeof exports !== "undefined" && typeof module !== "undefined") {
    factory(exports, module, require("../util/assign"), require("./init"), require("../global/registry"));
  }
})(function (exports, module, _utilAssign, _init, _globalRegistry) {
  "use strict";

  var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

  var assign = _interopRequire(_utilAssign);

  var init = _interopRequire(_init);

  var registry = _interopRequire(_globalRegistry);

  var specialMap = {
    caption: "table",
    dd: "dl",
    dt: "dl",
    li: "ul",
    tbody: "table",
    td: "tr",
    thead: "table",
    tr: "tbody"
  };

  function matchTag(dom) {
    var tag = dom.match(/\s*<([^\s>]+)/);
    return tag && tag[1];
  }

  function createFromHtml(html) {
    var par = document.createElement(specialMap[matchTag(html)] || "div");
    par.innerHTML = html;
    return init(par.firstElementChild);
  }

  function createFromName(name) {
    var ctor = registry.get(name);
    return ctor && ctor() || document.createElement(name);
  }

  module.exports = function (name, props) {
    name = name.trim();
    return assign(name[0] === "<" ? createFromHtml(name) : createFromName(name), props);
  };
});