const elementPrototypeContains = typeof window === 'undefined' ? () => {} : window.HTMLElement.prototype.contains;

export default function (source, target) {
  // The document element does not have the contains method in IE.
  if (source === document && !source.contains) {
    return document.head.contains(target) || document.body.contains(target);
  }

  return source.contains ? source.contains(target) : elementPrototypeContains.call(source, target);
}
