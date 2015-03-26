if (typeof document.registerElement === 'function') {
  return;
}

var oldCreateElement = document.createElement.bind(document);
document.createElement = function (name, parent) {
  var element = oldCreateElement(name);
  parent && element.setAttribute('is', parent);
  return element;
}
