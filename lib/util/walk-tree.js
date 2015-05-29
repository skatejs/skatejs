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

  var NodeFilter = window.NodeFilter;

  function createElementTreeWalker(element) {
    return document.createTreeWalker(element, NodeFilter.SHOW_ELEMENT, function (node) {
      return (0, _ignored2['default'])(node) ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT;
    }, true);
  }

  module.exports = function (elements, callback) {
    var elementsLength = elements.length;
    for (var a = 0; a < elementsLength; a++) {
      var element = elements[a];

      // We screen the root node only. The rest of the nodes are screened in the
      // tree walker.
      if (element.nodeType !== 1 || (0, _ignored2['default'])(element)) {
        continue;
      }

      // The tree walker doesn't include the current element.
      callback(element);

      var elementWalker = createElementTreeWalker(element);
      while (elementWalker.nextNode()) {
        callback(elementWalker.currentNode);
      }
    }
  };
});