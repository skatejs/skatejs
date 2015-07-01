(function (factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "module", "../util/maybe-this", "./emit"], factory);
  } else if (typeof exports !== "undefined" && typeof module !== "undefined") {
    factory(exports, module, require("../util/maybe-this"), require("./emit"));
  }
})(function (exports, module, _utilMaybeThis, _emit) {
  "use strict";

  var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

  var maybeThis = _interopRequire(_utilMaybeThis);

  var emit = _interopRequire(_emit);

  /* jshint expr: true */
  module.exports = maybeThis(function (elem, name) {
    var detail = arguments[2] === undefined ? {} : arguments[2];

    // Notifications must *always* have:
    // - name
    // - newValue
    // - oldValue
    // but may contain other information.
    detail.name = name;
    detail.newValue === detail.newValue === undefined ? elem[name] : detail.newValue;
    detail.oldValue === detail.oldValue === undefined ? elem[name] : detail.oldValue;

    emit(elem, ["skate.property", "skate.property." + name], {
      detail: detail
    });
  });
});