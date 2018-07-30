// @flow

import type { CustomElement } from './types.js';
import { name } from './name.js';

export function define(Ctor: CustomElement): CustomElement {
  customElements.define(Ctor.is || name(), Ctor);
  return Ctor;
}
