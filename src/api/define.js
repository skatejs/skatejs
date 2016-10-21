import { name as $name } from '../util/symbols';
import Component from './component';
import uniqueId from '../util/unique-id';

export default function (name, opts) {
  const { customElements } = window;

  if (!customElements) {
    throw new Error('Skate requires native custom element support or a polyfill.');
  }

  // DEPRECATED
  //
  // The recommended way now is to pass a class that defines the "id" prop.
  if (typeof name === 'string') {
    opts.id = name;
  }

  // Once we remove the passing of a name we can remove the check for it here.
  if (!opts.id || customElements.get(opts.id)) {
    opts.id = uniqueId(opts.id);
  }

  // DEPRECATED
  //
  // Object literals.
  if (typeof opts === 'object') {
    opts = Component.extend(opts);
  }

  // This allows us to check this before instantiating the custom element to
  // find its name from the constructor in the vdom module, thus improving
  // performance but still falling back to a robust method.
  opts[$name] = opts.id;

  customElements.define(opts.id, opts, opts.extends ? { extends: opts.extends } : null);
  return opts;
}
