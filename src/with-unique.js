import { customElements, dashCase, HTMLElement, sym } from './util';

const _is = sym('_is');

let suffix = 0;

function formatName (prefix, suffix) {
  return (
    prefix.indexOf('-') === -1 ? `x-${prefix}` : prefix
  ) + (
    suffix ? `-${suffix}` : ''
  );
}

function generateName (Ctor) {
  const prefix = dashCase(Ctor.name) || 'element';
  while (customElements.get(formatName(prefix, suffix))) {
    suffix++;
  }
  return formatName(prefix, suffix++);
}

export const withUnique = (Base = HTMLElement) => class extends Base {
  static get is () {
    return this[_is] || (this[_is] = generateName(this));
  }
  static set is (is) {
    this[_is] = is;
  }
};
