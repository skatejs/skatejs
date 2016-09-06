import getAllKeys from './get-all-keys';

export default function (obj = {}) {
  return getAllKeys(obj, { enumOnly: false }).reduce((prev, curr) => {
    prev[curr] = Object.getOwnPropertyDescriptor(obj, curr);
    return prev;
  }, {});
}
