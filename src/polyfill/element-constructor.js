import createElement from './create-element';

export default function (id, options) {
  function CustomElement () {
    var element;
    var tagToExtend = options.extends;

    if (tagToExtend) {
      element = createElement(tagToExtend);
      element.setAttribute('is', id);
    } else {
      element = createElement(id);
    }

    // Ensure the definition prototype is up to date with the element's
    // prototype. This ensures that overwriting the element prototype still
    // works.
    options.prototype = CustomElement.prototype;

    // If they use the constructor we don't have to wait until it's attached.
    if (options.prototype.createdCallback) {
      options.prototype.createdCallback.call(element);
    }

    return element;
  }

  // This allows modifications to the element prototype propagate to the
  // definition prototype.
  CustomElement.prototype = options.prototype;

  return CustomElement;
}
