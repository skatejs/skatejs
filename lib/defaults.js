(function (factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "module"], factory);
  } else if (typeof exports !== "undefined" && typeof module !== "undefined") {
    factory(exports, module);
  }
})(function (exports, module) {
  "use strict";

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
    "extends": undefined,

    // The ID of the definition. This is automatically set in the `skate()`
    // function.
    id: "",

    // Properties and methods to add to each element.
    prototype: {},

    // The attribute name to add after calling the created() callback.
    resolvedAttribute: "resolved",

    // The template to replace the content of the element with.
    template: undefined,

    // The type of bindings to allow.
    type: "element",

    // The attribute name to remove after calling the created() callback.
    unresolvedAttribute: "unresolved"
  };
});