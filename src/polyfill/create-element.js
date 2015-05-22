import registry from './registry';
import supportsCustomElements from '../support/custom-elements';

var oldCreateElement = document.createElement.bind(document);

if (!supportsCustomElements()) {
  document.createElement = function (elementName, parentElementName) {
    var Ctor = registry.get(parentElementName || elementName);
    var element;

    if (Ctor.isElement && (!parentElementName || (parentElementName && Ctor.extends === elementName))) {
      return new Ctor();
    }

    element = oldCreateElement(elementName);

    if (parentElementName) {
      element.setAttribute('is', parentElementName);
    }

    return element;
  };
}

export default oldCreateElement;
