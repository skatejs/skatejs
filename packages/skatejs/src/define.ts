import { CustomElementConstructor } from './types';
import { name } from './name.js';

export function define(
  ctor: CustomElementConstructor
): CustomElementConstructor {
  if (!ctor.is) {
    ctor.is = name();
  }
  customElements.define(ctor.is, ctor);
  return ctor;
}
