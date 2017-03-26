import { root } from './util';

export function define (Ctor) {
  const { customElements } = root;
  const { is } = Ctor;
  if (!customElements.get(is)) {
    customElements.define(is, Ctor);
  }
  return Ctor;
}
