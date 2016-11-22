/**
 * Returns and array of owned property names strings and owned symbols on the given object
 * By default it includes the enumerable and non-enumerable properties
 */
export default function keys (obj = {}, { enumOnly = false } = {}):any[] {
  const listOfKeys:any[] = Object[enumOnly ? 'keys' : 'getOwnPropertyNames'](obj);
  return typeof Object.getOwnPropertySymbols === 'function'
    ? listOfKeys.concat(Object.getOwnPropertySymbols(obj))
    : listOfKeys;
}
