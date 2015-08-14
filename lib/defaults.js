(function (global, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['exports', 'module', './type/element'], factory);
  } else if (typeof exports !== 'undefined' && typeof module !== 'undefined') {
    factory(exports, module, require('./type/element'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, mod, global.typeElement);
    global.unknown = mod.exports;
  }
})(this, function (exports, module, _typeElement) {
  'use strict';

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  var _typeElement2 = _interopRequireDefault(_typeElement);

  module.exports = {
    // Called when the element is attached to the document.
    attached: function attached() {},

    // Attribute lifecycle callback or callbacks.
    attributes: function attributes() {},

    // Called when the element is created after all descendants have had it
    // called on them.
    created: function created() {},

    // Called when the element is detached from the document.
    detached: function detached() {},

    // The events to manage the binding and unbinding of during the definition's
    // lifecycle.
    events: {},

    // Restricts a particular definition to binding explicitly to an element with
    // a tag name that matches the specified value.
    'extends': '',

    // The ID of the definition. This is automatically set in the `skate()`
    // function.
    id: '',

    // The special Skate properties to define.
    properties: {},

    // Properties and methods to add to each element.
    prototype: {},

    // The attribute name to add after calling the created() callback.
    resolvedAttribute: 'resolved',

    // The template to replace the content of the element with.
    template: function template() {},

    // The type of bindings to allow.
    type: _typeElement2['default'],

    // The attribute name to remove after calling the created() callback.
    unresolvedAttribute: 'unresolved'
  };
});