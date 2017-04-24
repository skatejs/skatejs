// @flow

// TODO (get-typed)
//
// Not support for a ternary or iife yet, so we must if / else and export let.
let root: Object;
if (typeof window === 'undefined') {
  root = window;
} else {
  root = global;
}
export { root };

// TODO (get-typed)
//
// There's no support for destructuring and exporting yet so we must do this
// differently.
//
// const {
//   customElements,
//   Event,
//   HTMLElement,
//   MutationObserver,
//   Node,
//   Object
// } = root;
const customElements: Class<CustomElementRegistry> = root.customElements;
const Event: Class<Event> = root.Event;
const HTMLElement: Class<HTMLElement> = root.HTMLElement;
const MutationObserver: Class<MutationOberver> = root.MutationObserver;
const Node: Class<Node> = root.Node;
const Object: Function = root.Object;
const {
  getOwnPropertyNames,
  getOwnPropertySymbols
} = Object;

export {
  customElements,
  Event,
  HTMLElement,
  Node
};

export function dashCase (str: string): string {
  return str.split(/([_A-Z])/).reduce((one, two, idx) => {
    const dash = !one || idx % 2 === 0 ? '' : '-';
    two = two === '_' ? '' : two;
    return `${one}${dash}${two.toLowerCase()}`;
  });
}

export function debounce (cbFunc: Function): Function {
  let scheduled = false;
  let i = 0;
  let cbArgs = [];
  const elem = document.createElement('span');
  const observer = new MutationObserver(() => {
    cbFunc(...cbArgs);
    scheduled = false;
    cbArgs = null;
  });

  observer.observe(elem, { childList: true });

  return (...args: Array<any>): void => {
    cbArgs = args;
    if (!scheduled) {
      scheduled = true;
      elem.textContent = `${i}`;
      i += 1;
    }
  };
}

export const empty = (val: any): boolean => val == null;
export const { freeze } = Object;

export function keys (obj: Object = {}): Array<string> {
  const names = getOwnPropertyNames(obj);
  return getOwnPropertySymbols ? names.concat(getOwnPropertySymbols(obj)) : names;
}

export function sym (description?: string): Symbol | string {
  return typeof Symbol === 'function'
    ? Symbol(description ? String(description) : undefined)
    : uniqueId(description);
}

export function uniqueId (description?: string): string {
  return (description ? String(description) : '') + 'xxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}
