import { customElements, dashCase } from '.';

let suffix = 0;

export function formatName (prefix, suffix) {
  prefix = prefix || 'element';
  return (
    prefix.indexOf('-') === -1 ? `x-${prefix}` : prefix
  ) + (
    suffix ? `-${suffix}` : ''
  );
}

export function generateName (Ctor) {
  const prefix = dashCase(Ctor.name);
  while (customElements.get(formatName(prefix, suffix))) {
    suffix++;
  }
  return formatName(prefix, suffix++);
}
