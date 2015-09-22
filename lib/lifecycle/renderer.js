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

  function renderer(elem, opts) {
    var render = opts.render;
    var rendered = undefined;
    var renderer = opts.renderer;

    if (elem.hasAttribute(opts.resolvedAttribute)) {
      return;
    }

    rendered = render && render(elem);

    if (renderer) {
      renderer(elem, rendered);
    } else if (rendered) {
      elem.innerHTML = rendered;
    }
  }
});