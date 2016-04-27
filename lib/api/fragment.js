(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['module', 'exports', '../native/create-document-fragment', '../native/create-element', './init'], factory);
  } else if (typeof exports !== "undefined") {
    factory(module, exports, require('../native/create-document-fragment'), require('../native/create-element'), require('./init'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod, mod.exports, global.createDocumentFragment, global.createElement, global.init);
    global.fragment = mod.exports;
  }
})(this, function (module, exports, _createDocumentFragment, _createElement, _init) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = fragment;

  var _createDocumentFragment2 = _interopRequireDefault(_createDocumentFragment);

  var _createElement2 = _interopRequireDefault(_createElement);

  var _init2 = _interopRequireDefault(_init);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  var _window = window;
  var Node = _window.Node;
  var NodeList = _window.NodeList;
  var slice = Array.prototype.slice;
  var specialMap = {
    caption: 'table',
    dd: 'dl',
    dt: 'dl',
    li: 'ul',
    tbody: 'table',
    td: 'tr',
    thead: 'table',
    tr: 'tbody'
  };

  function resolveParent(tag, html) {
    var container = (0, _createElement2.default)('div');
    var levels = 0;
    var parentTag = specialMap[tag];

    while (parentTag) {
      html = '<' + parentTag + '>' + html + '</' + parentTag + '>';
      ++levels;
      parentTag = specialMap[parentTag];
    }

    container.innerHTML = html;
    var parent = container;

    for (var a = 0; a < levels; a++) {
      parent = parent.firstElementChild;
    }

    return parent;
  }

  function resolveTag(html) {
    var tag = html.match(/^<([^\s>]+)/);
    return tag && tag[1];
  }

  function resolveHtml(html) {
    return resolveParent(resolveTag(html), html);
  }

  function fragment() {
    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return args.reduce(function (frag, node) {
      if (typeof node === 'string') {
        node = fragment.apply(null, slice.call(resolveHtml(node).childNodes));
      } else if (node instanceof NodeList || Array.isArray(node)) {
        node = fragment.apply(null, slice.call(node));
      } else if (node instanceof Node) {
        (0, _init2.default)(node);
      }

      if (node) {
        frag.appendChild(node);
      }

      return frag;
    }, (0, _createDocumentFragment2.default)());
  }

  module.exports = exports['default'];
});