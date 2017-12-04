// @flow

import type { CustomElement } from './types';

export function define(Ctor: CustomElement): CustomElement {
  customElements.define(Ctor.is, Ctor);
  return Ctor;
}
