const CustomEvent = (function (CustomEvent) {
  if (CustomEvent) {
    try {
      new CustomEvent();
    } catch (e) {
      return undefined;
    }
  }
  return CustomEvent;
}(window.CustomEvent));

function createCustomEvent (name, opts = {}) {
  if (CustomEvent) {
    return new CustomEvent(name, opts);
  }
  const e = document.createEvent('CustomEvent');
  e.initCustomEvent(name, opts.bubbles, opts.cancelable, opts.detail);
  return e;
}

export default function (elem, name, opts = {}) {
  /* jshint expr: true */
  opts.bubbles === undefined && (opts.bubbles = true);
  opts.cancelable === undefined && (opts.cancelable = true);
  return elem.disabled ? true : elem.dispatchEvent(createCustomEvent(name, opts));
}
