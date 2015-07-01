(function (factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "module", "../api/chain", "../util/data"], factory);
  } else if (typeof exports !== "undefined" && typeof module !== "undefined") {
    factory(exports, module, require("../api/chain"), require("../util/data"));
  }
})(function (exports, module, _apiChain, _utilData) {
  "use strict";

  var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

  var apiChain = _interopRequire(_apiChain);

  var data = _interopRequire(_utilData);

  module.exports = function (opts) {
    var callback = apiChain(opts.attribute);

    /* jshint expr: true */
    return function (name, oldValue, newValue) {
      var info = data(this);
      var attributeToPropertyMap = info.attributeToPropertyMap || {};

      callback.call(this, name, oldValue, newValue);

      // Ensure properties are notified of this change. We only do this if we're
      // not already updating the attribute from the property. This is so that
      // we don't invoke an infinite loop.
      if (attributeToPropertyMap[name] && !info.updatingAttribute) {
        info.updatingProperty = true;
        this[attributeToPropertyMap[name]] = newValue === null ? undefined : newValue;
        info.updatingProperty = false;
      }
    };
  };
});