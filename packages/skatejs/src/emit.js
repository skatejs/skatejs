// @flow

import type { CustomElementEvent, CustomElementEventOptions } from './types.js';

const defs: CustomElementEventOptions = {
  bubbles: true,
  cancelable: true,
  composed: false
};

export function emit(
  elem: HTMLElement,
  name: string,
  opts: CustomElementEventOptions
): boolean {
  opts = { ...defs, ...opts };
  let e: CustomElementEvent;
  if ('composed' in CustomEvent.prototype) {
    e = new CustomEvent(name, opts);
  } else {
    e = (document.createEvent('CustomEvent'): CustomElementEvent);
    // $FlowFixMe
    e.initCustomEvent(name, opts.bubbles, opts.cancelable, opts.detail);
    Object.defineProperty(e, 'composed', { value: opts.composed });
  }
  return elem.dispatchEvent(e);
}
