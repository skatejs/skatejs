// @flow

import { ComposedCustomEvent, EventOptions } from './types';

const defs: EventOptions = {
  bubbles: true,
  cancelable: true,
  composed: false
};

declare global{
    interface CustomEventInit {
        composed: boolean;
    }
    interface CustomEvent {
        composed: boolean;
    }
}

const hasNativeSupport = verifyNativeEventSupport();

function verifyNativeEventSupport() {
    try {
        const detail = {};
        const test = new CustomEvent('testEvent', { composed: true, detail });
        return test.composed === true && test.detail === detail;
    } catch (error) {
        return false;
    }
}

export function emit (elem: HTMLElement, name: string, opts: EventOptions): boolean {
  opts = { ...defs, ...opts };
  let e: ComposedCustomEvent;
  if(hasNativeSupport){
    e = new CustomEvent(name, opts);
  } else {
    e: ComposedCustomEvent = document.createEvent('CustomEvent');
    e.initCustomEvent(name, opts.bubbles, opts.cancelable, opts.detail);
    Object.defineProperty(e, 'composed', { value: opts.composed }); 
  }
  return elem.dispatchEvent(e);
}
