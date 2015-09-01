(function (global, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['exports', 'module', './ignored'], factory);
  } else if (typeof exports !== 'undefined' && typeof module !== 'undefined') {
    factory(exports, module, require('./ignored'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, mod, global.ignored);
    global.unknown = mod.exports;
  }
})(this, function (exports, module, _ignored) {
  'use strict';

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  var _ignored2 = _interopRequireDefault(_ignored);

  var Node = window.Node;

  function walk(elem, fn, filter) {
    if (elem.nodeType !== Node.ELEMENT_NODE || (0, _ignored2['default'])(elem) || filter && filter(elem) === false) {
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
    if (!elems) {
      return;
    }

    if (elems instanceof Node) {
      elems = [elems];
    }

    for (var a = 0; a < elems.length; a++) {
      walk(elems[a], fn, filter);
    }
  };
});