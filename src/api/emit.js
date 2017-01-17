import root from '../util/root';

const Event = ((TheEvent) => {
  if (TheEvent) {
    try {
      new TheEvent('emit-init'); // eslint-disable-line no-new
    } catch (e) {
      return undefined;
    }
  }
  return TheEvent;
})(root.Event);

function createCustomEvent (name, opts = {}) {
  const { detail } = opts;
  delete opts.detail;

  let e;
  if (Event) {
    e = new Event(name, opts);
    Object.defineProperty(e, 'detail', { value: detail });
  } else {
    e = document.createEvent('CustomEvent');
    Object.defineProperty(e, 'composed', { value: opts.composed });
    e.initCustomEvent(name, opts.bubbles, opts.cancelable, detail);
  }
  return e;
}

export default function (elem, name, opts = {}) {
  if (opts.bubbles === undefined) {
    opts.bubbles = true;
  }
  if (opts.cancelable === undefined) {
    opts.cancelable = true;
  }
  if (opts.composed === undefined) {
    opts.composed = true;
  }
  return elem.dispatchEvent(createCustomEvent(name, opts));
}
