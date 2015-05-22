import createElement from '../polyfill/create-element';

var elProto = window.HTMLElement.prototype;
var nativeMatchesSelector = (
  elProto.matches ||
  elProto.msMatchesSelector ||
  elProto.webkitMatchesSelector ||
  elProto.mozMatchesSelector ||
  elProto.oMatchesSelector
);

// Only IE9 has this msMatchesSelector bug, but best to detect it.
var hasNativeMatchesSelectorDetattachedBug = !nativeMatchesSelector.call(createElement('div'), 'div');

export default function (element, selector) {
  if (hasNativeMatchesSelectorDetattachedBug) {
    var clone = element.cloneNode();
    createElement('div').appendChild(clone);
    return nativeMatchesSelector.call(clone, selector);
  }
  return nativeMatchesSelector.call(element, selector);
}
