import typeElement from './type/element';

export default {
  // Called when the element is attached to the document.
  attached: function () {},

  // Attribute lifecycle callback or callbacks.
  attribute: function () {},

  // Called when the element is created after all descendants have had it
  // called on them.
  created: function () {},

  // Called when the element is detached from the document.
  detached: function () {},

  // The events to manage the binding and unbinding of during the definition's
  // lifecycle.
  events: {},

  // Restricts a particular definition to binding explicitly to an element with
  // a tag name that matches the specified value.
  extends: '',

  // The ID of the definition. This is automatically set in the `skate()`
  // function.
  id: '',

  // The special Skate properties to define.
  properties: {},

  // Properties and methods to add to each element.
  prototype: {},

  // The attribute name to add after calling the created() callback.
  resolvedAttribute: 'resolved',

  // Called after all lifecycle callbacks have been called.
  ready: function () {},

  // The type of bindings to allow.
  type: typeElement,

  // The attribute name to remove after calling the created() callback.
  unresolvedAttribute: 'unresolved'
};
