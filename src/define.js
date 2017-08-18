// @flow

import type { FixedCustomElementRegistry, CustomElement } from "./types";

export function define<T: Class<CustomElement>>(Ctor: T): T {
  const registry: FixedCustomElementRegistry = customElements;
  const is = Ctor.is;
  if (!registry.get(is)) {
    registry.define(is, Ctor);
  }
  return Ctor;
}
