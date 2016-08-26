
export default function (obj, enumerable = false) {
  return [
    ...Object[enumerable ? 'getOwnPropertyNames' : 'keys'](obj),
    ...Object.getOwnPropertySymbols(obj),
  ];
}
