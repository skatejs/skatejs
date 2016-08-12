const CustomEvent = ((Event) => {
  if (Event) {
    try {
      new Event(); // eslint-disable-line no-new
    } catch (e) {
      return undefined;
    }
  }
  return Event;
})(window.CustomEvent);

function createCustomEvent(name, opts = {}) {
  if (CustomEvent) {
    return new CustomEvent(name, opts);
  }
  const e = document.createEvent('CustomEvent');
  e.initCustomEvent(name, opts.bubbles, opts.cancelable, opts.detail);
  return e;
}

export default function (elem, name, opts = {}) {
  if (opts.bubbles === undefined) {
    opts.bubbles = true;
  }
  if (opts.cancelable === undefined) {
    opts.cancelable = true;
  }
  return elem.dispatchEvent(createCustomEvent(name, opts));
}
