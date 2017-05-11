import { defineProperty } from './util';

const defs = {
  bubbles: true,
  cancelable: true,
  composed: false
};

export function emit (elem, name, opts) {
  opts = { ...defs, ...opts };
  const e = document.createEvent('CustomEvent');
  e.initCustomEvent(name, opts.bubbles, opts.cancelable, opts.detail);
  defineProperty(e, 'composed', { value: opts.composed });
  return elem.dispatchEvent(e);
}
