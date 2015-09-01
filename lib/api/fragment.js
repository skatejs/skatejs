(function (global, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['exports', 'module', './init', '../util/create-from-html'], factory);
  } else if (typeof exports !== 'undefined' && typeof module !== 'undefined') {
    factory(exports, module, require('./init'), require('../util/create-from-html'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, mod, global.init, global.createFromHtml);
    global.unknown = mod.exports;
  }
})(this, function (exports, module, _init, _utilCreateFromHtml) {
  'use strict';

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  var _init2 = _interopRequireDefault(_init);

  var _createFromHtml = _interopRequireDefault(_utilCreateFromHtml);

  var DocumentFragmentPrototype = DocumentFragment.prototype;
  var slice = Array.prototype.slice;

  function decorateFragmentMethods(frag) {
    frag.appendChild = function (el) {
      return DocumentFragmentPrototype.appendChild.call(this, (0, _init2['default'])(el));
    };

    frag.insertBefore = function (el, beforeEl) {
      return DocumentFragmentPrototype.insertBefore.call(this, (0, _init2['default'])(el), beforeEl);
    };

    frag.replaceChild = function (el, replacedEl) {
      return DocumentFragmentPrototype.replaceChild.call(this, (0, _init2['default'])(el), replacedEl);
    };

    frag.cloneNode = function () {
      var clone = DocumentFragmentPrototype.cloneNode.apply(this, arguments);
      decorateFragmentMethods(clone);
      var children = slice.call(clone.childNodes);
      for (var i = 0; i < children.length; i++) {
        (0, _init2['default'])(children[i]);
      }
      return clone;
    };
  }

  module.exports = function (html) {
    var frag = document.createDocumentFragment();
    decorateFragmentMethods(frag);
    if (typeof html === 'string') {
      var par = (0, _createFromHtml['default'])(html);
      while (par.firstElementChild) {
        frag.appendChild(par.firstElementChild);
      }
    }
    return frag;
  };
});