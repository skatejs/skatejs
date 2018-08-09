import { CustomElementEvent, CustomElementEventOptions } from './types';

const defs: CustomElementEventOptions = {
  bubbles: true,
  cancelable: true,
  composed: false
};

export function emit(
  elem: HTMLElement,
  name: string,
  opts?: CustomElementEventOptions
): boolean {
  const eventOptions = { ...defs, ...opts };
  let e: CustomElementEvent;
  if ('composed' in CustomEvent.prototype) {
    e = new CustomEvent(name, eventOptions);
  } else {
    e = document.createEvent('CustomEvent');
    e.initCustomEvent(
      name,
      eventOptions.bubbles,
      eventOptions.cancelable,
      eventOptions.detail
    );
    Object.defineProperty(e, 'composed', { value: eventOptions.composed });
  }
  return elem.dispatchEvent(e);
}
