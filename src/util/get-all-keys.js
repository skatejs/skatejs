
export default function keys(obj, { enumerable = false } = {}) {
  const method = enumerable ? 'getOwnPropertyNames' : 'keys';
  const listOfKeys = Object[method](obj);
  if (typeof Object.getOwnPropertySymbols === 'function') {
    listOfKeys.push(...Object.getOwnPropertySymbols(obj));
  }
  return listOfKeys;
}
