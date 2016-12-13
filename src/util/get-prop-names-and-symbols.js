import { isFunction } from './is-type';
/**
 * Returns array of owned property names and symbols for the given object
 */
export default function getPropNamesAndSymbols (obj = {}) {
  const listOfKeys = Object.getOwnPropertyNames(obj);
  return isFunction(Object.getOwnPropertySymbols)
    ? listOfKeys.concat(Object.getOwnPropertySymbols(obj))
    : listOfKeys;
}
