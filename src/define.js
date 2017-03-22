import { root, uniqueId } from './util';

export function define (Ctor) {
  const { customElements } = root;

  // We must use hasOwnProperty() because we want to know if it was specified
  // directly on this class, not subclasses, as we don't want to inherit tag
  // names from subclasses.
  if (!Ctor.hasOwnProperty('is')) {
    // If we used defineProperty() then the consumer must also use it and
    // cannot use property initialisers. Instead we just set it so they can
    // use whatever method of overridding that they want.
    Ctor.is = `x-${uniqueId()}`;
  }
  customElements.define(Ctor.is, Ctor);

  // The spec doesn't return but this allows for a simpler, more concise API.
  return Ctor;
}
