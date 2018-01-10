import { name } from './name';

export function define(Ctor) {
  customElements.define(Ctor.is || name(), Ctor);
  return Ctor;
}
