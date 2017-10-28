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

export function prop(obj: Object, key: String, value: any) {
  Object.defineProperty(obj, key, {
    configurable: true,
    value
  });
}

let symbolCount = 0;
export function sym(description?: string): Symbol | string {
  description = String(description || ++symbolCount);
  return typeof Symbol === 'function'
    ? Symbol(description)
    : `__skate_${description}`;
}
