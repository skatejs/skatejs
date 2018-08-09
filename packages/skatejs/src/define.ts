import { CustomElementConstructor } from './types';
import { name } from './name.js';

export function define(Ctor: CustomElementConstructor): CustomElementConstructor {
  customElements.define(Ctor.is || name(), Ctor);
  return Ctor;
}
