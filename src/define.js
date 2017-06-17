// @flow

import type { FixedCustomElementRegistry, CustomElement } from './types';

export function define (Ctor: Class<CustomElement>): Class<CustomElement> {
  const registry: FixedCustomElementRegistry = customElements;
  const is = Ctor.is;
  if (!registry.get(is)) {
    registry.define(is, Ctor);
  }
  return Ctor;
}
