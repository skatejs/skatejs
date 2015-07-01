(function (factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "module", "../api/chain", "../api/event", "../api/property", "../util/assign-safe", "../util/data", "../util/protos", "../global/registry", "../util/walk-tree"], factory);
  } else if (typeof exports !== "undefined" && typeof module !== "undefined") {
    factory(exports, module, require("../api/chain"), require("../api/event"), require("../api/property"), require("../util/assign-safe"), require("../util/data"), require("../util/protos"), require("../global/registry"), require("../util/walk-tree"));
  }
})(function (exports, module, _apiChain, _apiEvent, _apiProperty, _utilAssignSafe, _utilData, _utilProtos, _globalRegistry, _utilWalkTree) {
  "use strict";

  var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

  var apiChain = _interopRequire(_apiChain);

  var apiEvent = _interopRequire(_apiEvent);

  var apiProperty = _interopRequire(_apiProperty);

  var assignSafe = _interopRequire(_utilAssignSafe);

  var data = _interopRequire(_utilData);

  var protos = _interopRequire(_utilProtos);

  var registry = _interopRequire(_globalRegistry);

  var walkTree = _interopRequire(_utilWalkTree);

  var elProto = window.Element.prototype;
  var oldSetAttribute = elProto.setAttribute;
  var oldRemoveAttribute = elProto.removeAttribute;

  function patchAttributeMethods(elem) {
    elem.setAttribute = function (name, newValue) {
      var oldValue = this.getAttribute(name);
      oldSetAttribute.call(elem, name, newValue);
      elem.attributeChangedCallback(name, oldValue, String(newValue));
    };

    elem.removeAttribute = function (name) {
      var oldValue = this.getAttribute(name);
      oldRemoveAttribute.call(elem, name);
      elem.attributeChangedCallback(name, oldValue, null);
    };
  }

  function triggerAttributesCreated(elem) {
    var attrs = elem.attributes;
    var attrsLength = attrs.length;
    for (var a = 0; a < attrsLength; a++) {
      var attr = attrs[a];
      elem.attributeChangedCallback(attr.name, null, attr.value);
    }
  }

  function markAsResolved(elem, resolvedAttribute, unresolvedAttribute) {
    elem.removeAttribute(unresolvedAttribute);
    elem.setAttribute(resolvedAttribute, "");
  }

  function callCreatedOnDescendants(elem, id) {
    walkTree(elem.childNodes, function (child) {
      registry.find(child).forEach(function (Ctor) {
        return Ctor.prototype.createdCallback.call(child);
      });
    }, function (child) {
      return !data(child, id).created;
    });
  }

  function fnOrApi(fn, api) {
    return typeof fn === "function" ? fn : api(fn);
  }

  function applyPrototype(proto) {
    var prototypes = protos(proto);
    return function () {
      var _this = this;

      prototypes.forEach(function (proto) {
        if (!proto.isPrototypeOf(_this)) {
          assignSafe(_this, proto);
        }
      });
    };
  }

  module.exports = function (opts) {
    var created = apiChain(opts.created);
    var events = fnOrApi(opts.events, apiEvent);
    var properties = fnOrApi(opts.properties, apiProperty);
    var prototype = applyPrototype(opts.prototype);
    var template = apiChain(opts.template);

    /* jshint expr: true */
    return function () {
      var info = data(this, opts.id);
      var isNative = this.createdCallback;

      if (info.created) {
        return;
      }

      info.created = true;
      isNative || prototype.call(this);
      isNative || patchAttributeMethods(this);
      template.call(this);
      properties.call(this);
      events.call(this);
      created.call(this);
      isNative || callCreatedOnDescendants(this, opts.id);
      triggerAttributesCreated(this);
      markAsResolved(this, opts.resolvedAttribute, opts.unresolvedAttribute);
    };
  };
});