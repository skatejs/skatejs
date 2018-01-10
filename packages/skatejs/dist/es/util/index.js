export function dashCase(str) {
  return typeof str === 'string'
    ? str.split(/([_A-Z])/).reduce(function(one, two, idx) {
        var dash = !one || idx % 2 === 0 ? '' : '-';
        two = two === '_' ? '' : two;
        return '' + one + dash + two.toLowerCase();
      })
    : str;
}

export var empty = function empty(val) {
  return val == null;
};

export function keys(obj) {
  obj = obj || {};
  var names = Object.getOwnPropertyNames(obj);
  return Object.getOwnPropertySymbols
    ? names.concat(Object.getOwnPropertySymbols(obj))
    : names;
}

var symbolCount = 0;
export function sym(description) {
  description = String(description || ++symbolCount);
  return typeof Symbol === 'function'
    ? Symbol(description)
    : '__skate_' + description;
}
