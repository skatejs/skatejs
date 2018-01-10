import { dashCase } from './util';

function format(prefix, suffix) {
  return (
    (prefix.indexOf('-') === -1 ? `x-${prefix}` : prefix) +
    (suffix ? `-${suffix}` : '')
  );
}

export function name(prefix = 'element') {
  prefix = dashCase(prefix);
  let suffix = 0;
  while (customElements.get(format(prefix, suffix))) ++suffix;
  return format(prefix, suffix);
}
