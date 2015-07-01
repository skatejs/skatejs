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

  function callAttachedOnDescendants(elem, id) {
    walkTree(elem.childNodes, function (child) {
      registry.find(child).forEach(function (Ctor) {
        return Ctor.prototype.attachedCallback.call(child);
      });
    }, function (child) {
      return !data(child, id).attached;
    });
  }

  module.exports = function (opts) {
    /* jshint expr: true */
    return function () {
      var info = data(this, opts.id);
      var isNative = this.attachedCallback;

      if (info.attached) {
        return;
      }

      info.attached = true;
      apiChain(opts.attached).call(this);
      isNative || callAttachedOnDescendants(this, opts.id);
      info.detached = false;
    };
  };
});