import { customElements } from "@skatejs/globals";

const ctorToNameMap = new WeakMap();

function dashcase(str: string): string {
  return str.split(/([_A-Z])/).reduce((one, two, idx) => {
    const dash = !one || idx % 2 === 0 ? "" : "-";
    two = two === "_" ? "" : two;
    return `${one}${dash}${two.toLowerCase()}`;
  });
}

function format(prefix: string, suffix: number): string {
  return (
    (prefix.indexOf("-") === -1 ? `x-${prefix}` : prefix) +
    (suffix ? `-${suffix}` : "")
  );
}

export type Constructor = new (...args: any[]) => HTMLElement;

export default function define<T extends Constructor>(ctor: T) {
  if (!getName(ctor)) {
    const generatedName = generateName(ctor.name);
    ctorToNameMap.set(ctor, generatedName);
    customElements.define(generatedName, ctor);
  }
  return ctor;
}

export function generateName(prefix?: string): string {
  prefix = dashcase(prefix || "element");
  let suffix: number = 0;
  while (customElements.get(format(prefix, suffix))) ++suffix;
  return format(prefix, suffix);
}

export function getName(ctor: Constructor): string | void {
  let name = ctorToNameMap.get(ctor);
  if (!name) {
    try {
      name = new ctor().localName;
      ctorToNameMap.set(ctor, name);
    } catch (e) {}
  }
  return name;
}

export function setName<T extends Constructor>(name: string, ctor: T) {
  if (!customElements.get(name)) {
    ctor = getName(ctor) ? class extends ctor {} : ctor;
    ctorToNameMap.set(ctor, name);
    customElements.define(name, ctor);
  }
  return ctor;
}
