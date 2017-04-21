// @flow

import { customElements } from './util';

export function define (Ctor: Function) {
  const { is } = Ctor;
  if (!customElements.get(is)) {
    customElements.define(is, Ctor);
  }
  return Ctor;
}
