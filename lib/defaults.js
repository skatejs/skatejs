(function (global, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['exports', 'module', './constants'], factory);
  } else if (typeof exports !== 'undefined' && typeof module !== 'undefined') {
    factory(exports, module, require('./constants'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, mod, global.constants);
    global.unknown = mod.exports;
  }
})(this, function (exports, module, _constants) {
  'use strict';

  module.exports = {
    // Called when the element is attached to the document.
    attached: function attached() {},

    // Attribute lifecycle callback or callbacks.
    attributes: undefined,

    // Called when the element is created.
    created: function created() {},

    // Called when the element is detached from the document.
    detached: function detached() {},

    // The events to manage the binding and unbinding of during the definition's
    // lifecycle.
    events: undefined,

    // Restricts a particular definition to binding explicitly to an element with
    // a tag name that matches the specified value.
    'extends': undefined,

    // The ID of the definition. This is automatically set in the `skate()`
    // function.
    id: '',

    // Properties and methods to add to each element.
    prototype: {},

    // The attribute name to add after calling the created() callback.
    resolvedAttribute: 'resolved',

    // The template to replace the content of the element with.
    template: undefined,

    // The type of bindings to allow.
    type: _constants.TYPE_ELEMENT,

    // The attribute name to remove after calling the created() callback.
    unresolvedAttribute: 'unresolved'
  };
});