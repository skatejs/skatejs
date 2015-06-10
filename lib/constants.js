(function (global, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['exports'], factory);
  } else if (typeof exports !== 'undefined') {
    factory(exports);
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports);
    global.unknown = mod.exports;
  }
})(this, function (exports) {
  'use strict';

  Object.defineProperty(exports, '__esModule', {
    value: true
  });
  var ATTR_IGNORE = 'data-skate-ignore';
  exports.ATTR_IGNORE = ATTR_IGNORE;
  var EVENT_PREFIX = 'skate-property-';
  exports.EVENT_PREFIX = EVENT_PREFIX;
  var TYPE_ATTRIBUTE = 'attribute';
  exports.TYPE_ATTRIBUTE = TYPE_ATTRIBUTE;
  var TYPE_CLASSNAME = 'classname';
  exports.TYPE_CLASSNAME = TYPE_CLASSNAME;
  var TYPE_ELEMENT = 'element';
  exports.TYPE_ELEMENT = TYPE_ELEMENT;
});