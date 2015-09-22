(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "module"], factory);
  } else if (typeof exports !== "undefined" && typeof module !== "undefined") {
    factory(exports, module);
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, mod);
    global.renderer = mod.exports;
  }
})(this, function (exports, module) {
  "use strict";

  module.exports = renderer;
  var defaultRenderer = function defaultRenderer(elem, render) {
    elem.innerHTML = render();
  };

  function renderer(opts) {
    var render = opts.render ? opts.render : null;
    var renderer = opts.renderer ? opts.renderer.bind(opts) : defaultRenderer;
    var resolvedAttribute = opts.resolvedAttribute;

    return function (elem) {
      if (render && !elem.hasAttribute(resolvedAttribute)) {
        renderer(elem, render.bind(opts, elem));
      }
    };
  }
});