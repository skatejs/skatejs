
export default function keys(obj = {}, { enumerable = false } = {}) {
  const listOfKeys = Object[enumerable ? 'getOwnPropertyNames' : 'keys'](obj);
  return typeof Object.getOwnPropertySymbols === 'function' ?
    listOfKeys.concat(Object.getOwnPropertySymbols(obj)) :
    listOfKeys;
}
