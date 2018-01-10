export function dashCase(str) {
  return typeof str === 'string'
    ? str.split(/([_A-Z])/).reduce((one, two, idx) => {
        const dash = !one || idx % 2 === 0 ? '' : '-';
        two = two === '_' ? '' : two;
        return `${one}${dash}${two.toLowerCase()}`;
      })
    : str;
}

export const empty = val => val == null;

export function keys(obj) {
  obj = obj || {};
  const names = Object.getOwnPropertyNames(obj);
  return Object.getOwnPropertySymbols
    ? names.concat(Object.getOwnPropertySymbols(obj))
    : names;
}

let symbolCount = 0;
export function sym(description) {
  description = String(description || ++symbolCount);
  return typeof Symbol === 'function'
    ? Symbol(description)
    : `__skate_${description}`;
}
