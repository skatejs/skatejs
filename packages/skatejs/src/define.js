// @flow

import type { CustomElement } from './types';
import { name } from './name';

export function define(Ctor: CustomElement): CustomElement {
  customElements.define(Ctor.is || name(), Ctor);
  return Ctor;
}
