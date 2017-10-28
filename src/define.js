// @flow

import type { CustomElement } from './types';

export function define<T: Class<CustomElement>>(Ctor: T): T {
  const registry = customElements;
  const is = Ctor.is;
  if (is && !registry.get(is)) {
    registry.define(is, Ctor);
  }
  return Ctor;
}
