import { CustomElementConstructor } from './types';
import { name } from './name.js';

export function define(
  ctor: CustomElementConstructor
): CustomElementConstructor {
  Object.defineProperty(ctor, 'is', { value: name(ctor.is) });
  customElements.define(ctor.is, ctor);
  return ctor;
}
