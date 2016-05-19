const elProto = window.HTMLElement.prototype;
const nativeMatchesSelector = (
  elProto.matches ||
  elProto.msMatchesSelector ||
  elProto.webkitMatchesSelector ||
  elProto.mozMatchesSelector ||
  elProto.oMatchesSelector
);

// Only IE9 has this msMatchesSelector bug, but best to detect it.
const hasNativeMatchesSelectorDetattachedBug = !nativeMatchesSelector.call(document.createElement('div'), 'div');

export default function (element, selector) {
  if (hasNativeMatchesSelectorDetattachedBug) {
    const clone = element.cloneNode();
    document.createElement('div').appendChild(clone);
    return nativeMatchesSelector.call(clone, selector);
  }
  return nativeMatchesSelector.call(element, selector);
}
