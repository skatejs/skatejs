(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['exports', './ignored'], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require('./ignored'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.ignored);
    global.walkTree = mod.exports;
  }
})(this, function (exports, _ignored) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  exports.default = function (elems, fn) {
    if (!elems) {
      return;
    }

    if (elems instanceof Node) {
      elems = [elems];
    }

    for (var a = 0; a < elems.length; a++) {
      walk(elems[a], fn);
    }
  };

  var _ignored2 = _interopRequireDefault(_ignored);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  var Node = window.Node;

  function walk(elem, fn) {
    if (elem.nodeType !== Node.ELEMENT_NODE || (0, _ignored2.default)(elem)) {
      return;
    }

    var chren = elem.childNodes;
    var child = chren && chren[0];
    fn(elem);

    while (child) {
      walk(child, fn);
      child = child.nextSibling;
    }
  }
});