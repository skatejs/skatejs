import Component from './component';
import uniqueId from '../util/unique-id';
import root from 'window-or-global';

export default function (...args) {
  const { customElements, HTMLElement } = root;
  let [ name, Ctor ] = args;

  if (!customElements) {
    throw new Error('Skate requires native custom element support or a polyfill.');
  }

  // DEPRECATED remove when removing the "name" argument.
  if (DEBUG && args.legnth === 2) {
    console.warn('The "name" argument to define() is deprecated. Please define a `static is` property on the constructor instead.');
  }

  // DEPRECATED remove when removing the "name" argument.
  if (args.length === 1) {
    Ctor = name;
    name = null;
  }

  // DEPRECATED Object literals.
  if (typeof Ctor === 'object') {
    Ctor = Component.extend(Ctor);
  }

  // Ensure a custom element is passed.
  if (!(Ctor.prototype instanceof HTMLElement)) {
    throw new Error('You must provide a constructor that extends HTMLElement to define().');
  }

  // "is" takes precendence over "name" and falls back to a unique id
  let is = Ctor.is || name || uniqueId();

  // Ensure there's no conflicts.
  if (customElements.get(is)) {
    is = uniqueId(is);
  }

  // Ensure the "is" property is consistent.
  Ctor.is = is;

  // Simple define. Not supporting customised built-ins yet.
  customElements.define(is, Ctor);

  // The spec doesn't return but this allows for a simpler, more concise API.
  return Ctor;
}
