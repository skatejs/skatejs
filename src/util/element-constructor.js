import bindings from '../api/type';

function createElement (options) {
  var type = options.type;
  for (let a in bindings) {
    let binding = bindings[a];
    if (type === binding) {
      return binding.create(options);
    }
  }
}

export default function (options) {
  function CustomElement () {
    var element = createElement(options);

    // Ensure the definition prototype is up to date with the element's
    // prototype. This ensures that overwriting the element prototype still
    // works.
    options.prototype = CustomElement.prototype;

    // Initialises. This will always exist.
    options.prototype.createdCallback.call(element);

    return element;
  }

  // This allows modifications to the element prototype propagate to the
  // definition prototype.
  CustomElement.prototype = options.prototype;

  return CustomElement;
}
