/* jshint expr: true */
export default function (elem, name, opts = {}) {
  var e = document.createEvent('CustomEvent');
  opts.bubbles === undefined && (opts.bubbles = true);
  opts.cancelable === undefined && (opts.cancelable = true);
  e.initCustomEvent(name, opts.bubbles, opts.cancelable, opts.detail);
  return elem.dispatchEvent(e);
}
