const { body, head } = document;
const elementPrototype = window.HTMLElement.prototype;
const elementPrototypeContains = elementPrototype.contains;

export default function (source, target) {
  // The document element does not have the contains method in IE.
  if (source === document && !source.contains) {
    return head.contains(target) || body.contains(target);
  }
  return source.contains ? source.contains(target) : elementPrototypeContains.call(source, target);
}
