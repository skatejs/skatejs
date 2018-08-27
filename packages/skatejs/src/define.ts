import { CustomElementConstructor } from './types';
import { name } from './name';

export function define(
  ctor: CustomElementConstructor
): CustomElementConstructor {
  if (!ctor.is) {
    ctor.is = name(ctor.name);
    customElements.define(ctor.is, ctor);
  }
  return ctor;
}
