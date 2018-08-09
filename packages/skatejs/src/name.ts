export function dashCase(str: string): string {
  return typeof str === 'string'
    ? str.split(/([_A-Z])/).reduce((one, two, idx) => {
        const dash = !one || idx % 2 === 0 ? '' : '-';
        two = two === '_' ? '' : two;
        return `${one}${dash}${two.toLowerCase()}`;
      })
    : str;
}

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
