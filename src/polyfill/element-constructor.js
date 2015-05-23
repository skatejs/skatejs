import createElement from './create-element';

export default function (options) {
  function CustomElement () {
    var element;
    var elementName = options.id;
    var parentElementName = options.extends;

    if (parentElementName) {
      element = createElement(parentElementName);
      element.setAttribute('is', elementName);
    } else {
      element = createElement(elementName);
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
