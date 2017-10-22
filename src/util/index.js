// @flow

export function dashCase<T>(str: T): T {
  return typeof str === 'string'
    ? str.split(/([_A-Z])/).reduce((one, two, idx) => {
        const dash = !one || idx % 2 === 0 ? '' : '-';
        two = two === '_' ? '' : two;
        return `${one}${dash}${two.toLowerCase()}`;
      })
    : str;
}

export const empty = <T>(val: T): boolean => val == null;

export function keys(obj: Object | void): Array<any> {
  obj = obj || {};
  const names = Object.getOwnPropertyNames(obj);
  return Object.getOwnPropertySymbols
    ? names.concat(Object.getOwnPropertySymbols(obj))
    : names;
}

export function sym(description?: string): Symbol | string {
  return typeof Symbol === 'function'
    ? Symbol(description ? String(description) : undefined)
    : uniqueId(description);
}

export function uniqueId(description?: string): string {
  return (
    (description ? String(description) : '') +
    'xxxxxxxx'.replace(/[xy]/g, c => {
      const r = (Math.random() * 16) | 0;
      const v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    })
  );
}
