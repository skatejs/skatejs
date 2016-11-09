import { name as $name } from '../util/symbols';
import Component from './component';
import uniqueId from '../util/unique-id';
import root from 'window-or-global';

export default function (name, opts) {
  const { customElements } = root;

  if (!customElements) {
    throw new Error('Skate requires native custom element support or a polyfill.');
  }

  // Support passing an anonymous definition.
  if (!opts) {
    opts = name;
    name = null;
  }

  // Unique IDs.
  if (!name || customElements.get(name)) {
    name = uniqueId(name);
  }

  // Object literals.
  if (typeof opts === 'object') {
    opts = Component.extend(opts);
  }

  // This allows us to check this before instantiating the custom element to
  // find its name from the constructor in the vdom module, thus improving
  // performance but still falling back to a robust method.
  opts[$name] = name;

  customElements.define(name, opts, opts.extends ? { extends: opts.extends } : null);
  return opts;
}
