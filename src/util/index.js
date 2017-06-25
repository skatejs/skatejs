// @flow

const Mo = typeof MutationObserver === 'function' ? MutationObserver : class {
  func: Function;
  constructor (func) {
    this.func = func;
  }
  observe (node: HTMLElement) {
    const { func } = this;
    const prop: Object = {
      set () {
        if (typeof Promise === 'undefined') {
          setTimeout(func);
        } else {
          new Promise(resolve => resolve()).then(func);
        }
      }
    };
    Object.defineProperty(node, 'textContent', prop);
  }
};

export function dashCase (str: string): string {
  return str.split(/([_A-Z])/).reduce((one, two, idx) => {
    const dash = !one || idx % 2 === 0 ? '' : '-';
    two = two === '_' ? '' : two;
    return `${one}${dash}${two.toLowerCase()}`;
  });
}

export function debounce (cbFunc: () => void): Function {
  let scheduled = false;
  let i = 0;
  const elem = document.createElement('span');
  const observer = new Mo(() => {
    cbFunc();
    scheduled = false;
  });

  observer.observe(elem, { childList: true });

  return (): void => {
    if (!scheduled) {
      scheduled = true;
      elem.textContent = `${i}`;
      i += 1;
    }
  };
}

export const empty = <T> (val: T): boolean => val == null;

export function keys (obj: Object | void): Array<any> {
  obj = obj || {};
  const names = Object.getOwnPropertyNames(obj);
  return Object.getOwnPropertySymbols ? names.concat(Object.getOwnPropertySymbols(obj)) : names;
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
