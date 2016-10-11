
export default function keys(obj = {}, { enumOnly = false } = {}) {
  const listOfKeys = Object[enumOnly ? 'keys' : 'getOwnPropertyNames'](obj);
  return typeof Object.getOwnPropertySymbols === 'function' ?
    listOfKeys.concat(Object.getOwnPropertySymbols(obj)) :
    listOfKeys;
}
