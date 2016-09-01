
export default function keys(obj, enumerable = false) {
  let listOfKeys = [
    ...Object[enumerable ? 'getOwnPropertyNames' : 'keys'](obj),
  ];
  if (typeof Object.getOwnPropertySymbols === 'function') {
    listOfKeys = listOfKeys.concat(Object.getOwnPropertySymbols(obj));
  }
  return listOfKeys;
}
