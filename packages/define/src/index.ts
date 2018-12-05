export interface Constructor<T> {
  new (): T;
  is?: string;
  name: string;
}

const ctorToNameMap = new WeakMap();

function dashcase(str: string): string {
  return str.split(/([_A-Z])/).reduce((one, two, idx) => {
    const dash = !one || idx % 2 === 0 ? '' : '-';
    two = two === '_' ? '' : two;
    return `${one}${dash}${two.toLowerCase()}`;
  });
}

function format(prefix: string, suffix: number): string {
  return (
    (prefix.indexOf('-') === -1 ? `x-${prefix}` : prefix) +
    (suffix ? `-${suffix}` : '')
  );
}

export default function<T>(ctor: Constructor<T>): Constructor<T> {
  let currentName = getName(ctor);
  if (!currentName) {
    ctorToNameMap.set(ctor, (currentName = generateName(ctor.name)));
  }
  if (!customElements.get(currentName)) {
    customElements.define(currentName, ctor);
  }
  return ctor;
}

export function getName<T>(ctor: Constructor<T>): string | void {
  return ctor.is || ctorToNameMap.get(ctor);
}

export function generateName(prefix?: string): string {
  prefix = dashcase(prefix || 'element');
  let suffix: number = 0;
  while (customElements.get(format(prefix, suffix))) ++suffix;
  return format(prefix, suffix);
}
