import { root } from './util';

export function define (Ctor) {
  const { customElements } = root;
  customElements.define(Ctor.is, Ctor);
  return Ctor;
}
