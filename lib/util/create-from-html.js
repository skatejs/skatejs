(function (global, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['exports', 'module'], factory);
  } else if (typeof exports !== 'undefined' && typeof module !== 'undefined') {
    factory(exports, module);
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, mod);
    global.unknown = mod.exports;
  }
})(this, function (exports, module) {
  'use strict';

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
    var tag = html.match(/\s*<([^\s>]+)/);
    return tag && tag[1];
  }

  module.exports = function (html) {
    var tag = matchTag(html);
    return resolveParent(tag, html);
  };
});