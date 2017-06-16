// @flow

import { ComposedCustomEvent, EventOptions } from './types';

const defs: EventOptions = {
  bubbles: true,
  cancelable: true,
  composed: false
};

export function emit (elem: HTMLElement, name: string, opts: EventOptions): boolean {
  opts = { ...defs, ...opts };
  let e: ComposedCustomEvent;
  if ('composed' in CustomEvent.prototype) {
    e = new CustomEvent(name, opts);
  } else {
    e = document.createEvent('CustomEvent');
    e.initCustomEvent(name, opts.bubbles, opts.cancelable, opts.detail);
    Object.defineProperty(e, 'composed', { value: opts.composed });
  }
  return elem.dispatchEvent(e);
}
