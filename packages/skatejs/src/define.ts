import { CustomElementConstructor } from './types';
import { name } from './name.js';

export function define(
  ctor: CustomElementConstructor
): CustomElementConstructor {
  const tag = name();
  ctor = class extends ctor {
    static is = tag;
  };
  customElements.define(tag, ctor);
  return ctor;
}
