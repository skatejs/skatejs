(function (factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "module", "./chain", "../util/matches-selector", "../util/maybe-this"], factory);
  } else if (typeof exports !== "undefined" && typeof module !== "undefined") {
    factory(exports, module, require("./chain"), require("../util/matches-selector"), require("../util/maybe-this"));
  }
})(function (exports, module, _chain, _utilMatchesSelector, _utilMaybeThis) {
  "use strict";

  var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

  var apiChain = _interopRequire(_chain);

  var matches = _interopRequire(_utilMatchesSelector);

  var maybeThis = _interopRequire(_utilMaybeThis);

  function parseEvent(e) {
    var parts = e.split(" ");
    var name = parts.shift();
    var selector = parts.join(" ").trim();
    return {
      name: name,
      isAny: selector[0] === "*",
      isChild: selector[0] === ">",
      selector: selector
    };
  }

  function makeDelegateHandler(elem, handler, parsed) {
    return function (e) {
      var current = e.target;
      var selector = parsed.selector;

      // Any descendant.
      if (parsed.isAny) {
        e.delegateTarget = current;
        return handler(e);
      }

      // Specific children.
      if (parsed.isChild) {
        selector = "" + elem.tagName + " " + selector;
      }

      // Specific descendants.
      while (current && current !== elem.parentNode) {
        if (matches(current, selector)) {
          e.delegateTarget = current;
          return handler(e);
        }
        current = current.parentNode;
      }
    };
  }

  function makeNormalHandler(elem, handler) {
    return function (e) {
      if (e.target === elem) {
        e.delegateTarget = elem;
        handler(e);
      }
    };
  }

  function bindEvent(elem, event, handler) {
    var parsed = parseEvent(event);
    var name = parsed.name;
    var selector = parsed.selector;

    var capture = selector && (name === "blur" || name === "focus");
    handler = apiChain(handler).bind(elem);
    handler = selector ? makeDelegateHandler(elem, handler, parsed) : makeNormalHandler(elem, handler);
    elem.addEventListener(name, handler, capture);
  }

  function bindEvents(elem, events) {
    Object.keys(events).forEach(function (name) {
      bindEvent(elem, name, events[name]);
    });
  }

  module.exports = maybeThis(function (elem, events, handler) {
    if (typeof events === "string") {
      bindEvent(elem, events, handler);
    } else if (Array.isArray(events)) {
      events.forEach(function (e) {
        return bindEvent(elem, e, handler);
      });
    } else {
      bindEvents(elem, events || {});
    }
  });
});