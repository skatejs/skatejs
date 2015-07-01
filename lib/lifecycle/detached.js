(function (factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "module", "../api/chain", "../util/data", "../global/registry", "../util/walk-tree"], factory);
  } else if (typeof exports !== "undefined" && typeof module !== "undefined") {
    factory(exports, module, require("../api/chain"), require("../util/data"), require("../global/registry"), require("../util/walk-tree"));
  }
})(function (exports, module, _apiChain, _utilData, _globalRegistry, _utilWalkTree) {
  "use strict";

  var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

  var apiChain = _interopRequire(_apiChain);

  var data = _interopRequire(_utilData);

  var registry = _interopRequire(_globalRegistry);

  var walkTree = _interopRequire(_utilWalkTree);

  function callDetachedOnDescendants(elem, id) {
    walkTree(elem.childNodes, function (child) {
      registry.find(child).forEach(function (Ctor) {
        return Ctor.prototype.detachedCallback.call(child);
      });
    }, function (child) {
      return !data(child, id).detached;
    });
  }

  module.exports = function (opts) {
    /* jshint expr: true */
    return function () {
      var info = data(this, opts.id);
      var isNative = this.detachedCallback;

      if (info.detached) {
        return;
      }

      info.detached = true;
      apiChain(opts.detached).call(this);
      isNative || callDetachedOnDescendants(this, opts.id);
      info.attached = false;
    };
  };
});