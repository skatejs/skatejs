import {
  TYPE_ATTRIBUTE,
  TYPE_CLASS,
  TYPE_ELEMENT
} from '../constants';

const DEFAULT_ELEMENT = 'div';

function createElement (options) {
  var element;
  var id = options.id;
  var parent = options.extends;
  var type = options.type;

  // Allow all types of components to be constructed.
  if (type === TYPE_ELEMENT) {
    element = document.createElement(parent || id);

    if (parent) {
      element.setAttribute('is', id);
    }
  } else {
    element = document.createElement(parent || DEFAULT_ELEMENT);

    if (type === TYPE_ATTRIBUTE) {
      element.setAttribute(id, '');
    } else if (type === TYPE_CLASS) {
      element.className = id;
    }
  }

  return element;
}

export default function (options) {
  function CustomElement () {
    var element = createElement(options);

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
