// @flow

import type { FixedCustomElementRegistry } from '../types';

import { dashCase } from '.';

const registry: FixedCustomElementRegistry = customElements;
let suffix: number = 0;

export function formatName (prefix: string, suffix: number): string {
  prefix = prefix || 'element';
  return (
    prefix.indexOf('-') === -1 ? `x-${prefix}` : prefix
  ) + (
    suffix ? `-${suffix}` : ''
  );
}

export function generateName (Ctor: Function): string {
  const prefix = dashCase(Ctor.name);
  while (registry.get(formatName(prefix, suffix))) {
    suffix++;
  }
  return formatName(prefix, suffix++);
}
