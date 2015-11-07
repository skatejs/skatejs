(function (global, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['exports', 'module', './init'], factory);
  } else if (typeof exports !== 'undefined' && typeof module !== 'undefined') {
    factory(exports, module, require('./init'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, mod, global.init);
    global.fragment = mod.exports;
  }
})(this, function (exports, module, _init) {
  'use strict';

  module.exports = fragment;

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  var _init2 = _interopRequireDefault(_init);

  var Node = window.Node;
  var NodeList = window.NodeList;

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
    var container = document.createElement('div');
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
        (0, _init2['default'])(node);
      }

      if (node) {
        frag.appendChild(node);
      }

      return frag;
    }, document.createDocumentFragment());
  }
});