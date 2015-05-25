import nativeCreateElement from '../util/native-create-element';
import registry from './registry';

export default function (elementName, parentElementName) {
 var options = registry.get(parentElementName || elementName);
 var element = nativeCreateElement(elementName);

 // According to the spec, the "is" attribute is always set if a parent
 // element name is provided even if it has no corresponding registered
 // custom element.
 if (parentElementName) {
   element.setAttribute('is', parentElementName);
 }

 // We only initialise the element if it is an element component and:
 // - parentElementName is not provided
 // OR
 // - parentElementName matches definition.extends
 if (options && options.isElement && ((!parentElementName && !options.extends) || (elementName === options.extends))) {
   options.prototype.createdCallback.call(element);
 }

 return element;
}
