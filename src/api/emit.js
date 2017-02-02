import assign from '../util/assign';
import root from '../util/root';

// Once the Event constructor is newable cross-browser, this can be reomved.
const Event = (() => {
  try {
    const { Event } = root;
    // eslint-disable-next-line
    new Event('test');
    return Event;
  } catch (e) {
    return function (name, opts) {
      const e = document.createEvent('CustomEvent');
      Object.defineProperty(e, 'composed', { value: opts.composed });
      e.initCustomEvent(name, opts.bubbles, opts.cancelable, opts.detail);
      return e;
    };
  }
})();

const optsDefaults = {
  bubbles: true,
  cancelable: true,
  composed: false
};

export default function (elem, name, opts) {
  opts = assign({}, optsDefaults, opts);
  const e = new Event(name, opts);
  Object.defineProperty(e, 'detail', { value: opts.detail });
  return elem.dispatchEvent(e);
}
