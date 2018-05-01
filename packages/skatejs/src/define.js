// @flow

import type { CustomElement } from './types.js';
import { name } from './name.js';

export function define(Ctor: CustomElement): CustomElement {
  if (!Ctor.is) {
    Ctor = class extends Ctor {
      static is = name();
    };
  }
  customElements.define(Ctor.is, Ctor);
  return Ctor;
}
