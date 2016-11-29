import { name as $name } from '../util/symbols';
import Component from './component';
import uniqueId from '../util/unique-id';
import root from 'window-or-global';

export default function (...args) {
  const { customElements } = root;
  let [ name, Ctor ] = args;

  if (!customElements) {
    throw new Error('Skate requires native custom element support or a polyfill.');
  }

  // Support passing an anonymous definition.
  if (args.length === 1) {
    // We are checking string for now, but once we remove the ability to pass
    // an object literal, we can change this to check "function" and invert the
    // blocks of logic.
    if (typeof name === 'string') {
      throw new Error('When passing only one argument to define(), it must be a custom element constructor.');
    } else {
      Ctor = name;
      name = uniqueId();
    }
  }

  // Ensure there's no conflicts.
  if (customElements.get(name)) {
    name = uniqueId(name);
  }

  // DEPRECATED
  //
  // Object literals.
  if (typeof Ctor === 'object') {
    Ctor = Component.extend(Ctor);
  }

  // This allows us to check this before instantiating the custom element to
  // find its name from the constructor in the vdom module, thus improving
  // performance but still falling back to a robust method.
  Ctor[$name] = name;

  // Sipmle define. Not supporting customised built-ins yet.
  customElements.define(name, Ctor);

  // The spec doesn't return but this allows for a simpler, more concise API.
  return Ctor;
}
