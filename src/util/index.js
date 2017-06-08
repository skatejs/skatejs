// @flow

function _root () {
  if (typeof window === 'undefined') {
    return global;
  }
  return window;
}

const root: Object = _root();
const HTMLElement = root.HTMLElement;
const {
  customElements,
  Event,
  MutationObserver: RealMutationObserver,
  Node
} = root;

const {
  defineProperty,
  defineProperties,
  getOwnPropertyNames,
  getOwnPropertySymbols
} = Object;

export {
  customElements,
  defineProperty,
  defineProperties,
  Event,
  HTMLElement,
  Node,
  root
};

function FakeMutationObserver (func: Function) {
  this.func = func;
}
FakeMutationObserver.prototype.observe = function (node: Node) {
  const { func } = this;
  defineProperty(node, 'textContent', {
    set () {
      if (typeof Promise === 'undefined') {
        setTimeout(func);
      } else {
        new Promise(resolve => resolve()).then(func);
      }
    }
  });
};

const MutationObserver = RealMutationObserver || FakeMutationObserver;

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

export function keys (obj: Object = {}): Array<any> {
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
