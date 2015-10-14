import global from './global';

var el = global.HTMLElement;
var elProto = el && el.prototype;
var nativeMatchesSelector = elProto && (
  elProto.matches ||
  elProto.msMatchesSelector ||
  elProto.webkitMatchesSelector ||
  elProto.mozMatchesSelector ||
  elProto.oMatchesSelector
);

// Only IE9 has this msMatchesSelector bug, but best to detect it.
var hasNativeMatchesSelectorDetattachedBug = nativeMatchesSelector && !nativeMatchesSelector.call(document.createElement('div'), 'div');

export default function (element, selector) {
  if (hasNativeMatchesSelectorDetattachedBug) {
    var clone = element.cloneNode();
    document.createElement('div').appendChild(clone);
    return nativeMatchesSelector.call(clone, selector);
  }
  return nativeMatchesSelector.call(element, selector);
}
