// @flow

import { dashCase } from './util.js';

function format(prefix: string, suffix: number): string {
  return (
    (prefix.indexOf('-') === -1 ? `x-${prefix}` : prefix) +
    (suffix ? `-${suffix}` : '')
  );
}

export function name(prefix: string = 'element'): string {
  prefix = dashCase(prefix);
  let suffix: number = 0;
  while (customElements.get(format(prefix, suffix))) ++suffix;
  return format(prefix, suffix);
}
