// @flow

import { customElements, dashCase } from '.';

let suffix: number = 0;

export function formatName (prefix: string, suffix: number) {
  prefix = prefix || 'element';
  return (
    prefix.indexOf('-') === -1 ? `x-${prefix}` : prefix
  ) + (
    suffix ? `-${suffix}` : ''
  );
}

export function generateName (Ctor: Function) {
  const prefix = dashCase(Ctor.name);
  while (customElements.get(formatName(prefix, suffix))) {
    suffix++;
  }
  return formatName(prefix, suffix++);
}
