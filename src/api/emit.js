/* jshint expr: true */
function emit (name, opts) {
  var e = document.createEvent('CustomEvent');
  opts.bubbles === undefined && (opts.bubbles = true);
  opts.cancelable === undefined && (opts.cancelable = true);
  e.initCustomEvent(name, opts.bubbles, opts.cancelable, opts.detail);
  return this.dispatchEvent(e);
}

export default function (elem, name, opts = {}) {
  (name.split && name.split(' ') || []).forEach(emit.bind(elem, name, opts));
  return this;
}
