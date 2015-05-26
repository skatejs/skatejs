import registry from './registry';

export default function (elementName, parentElementName) {
  var Ctor = registry.get(parentElementName || elementName);
  var element;

  if (Ctor) {
    element = new Ctor();
  } else {
    element = document.createElement(elementName);

    // According to the spec, the "is" attribute is always set if a parent
    // element name is provided even if it has no corresponding registered
    // custom element.
    if (parentElementName) {
      element.setAttribute('is', parentElementName);
    }
  }

  return element;
}
