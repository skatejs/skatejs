// @flow

import type { FixedCustomElementRegistry, CustomElement } from './types';

const registry: FixedCustomElementRegistry = customElements;

export function define (Ctor: Class<CustomElement>): Class<CustomElement> {
  const is = Ctor.is;
  if (!registry.get(is)) {
    registry.define(is, Ctor);
  }
  return Ctor;
}
