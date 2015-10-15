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

  function matchTag(html) {
    var tag = html.match(/^<([^\s>]+)/);
    return tag && tag[1];
  }

  function buildFragment(frag, arg) {
    if (arg) {
      if (typeof arg === 'string') {
        arg = arg.trim();
        if (arg[0] === '<') {
          arg = resolveParent(matchTag(arg), arg).childNodes;
          arg = fragment.apply(null, slice.call(arg));
        } else {
          arg = document.createTextNode(arg);
        }
      } else if (arg.length) {
        arg = fragment.apply(null, slice.call(arg));
      } else if (arg.nodeType) {
        (0, _init2['default'])(arg);
      }
      frag.appendChild(arg);
    }
    return frag;
  }

  function fragment() {
    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return args.reduce(buildFragment, document.createDocumentFragment());
  }
});