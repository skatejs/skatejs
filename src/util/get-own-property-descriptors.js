import getAllKeys from './get-all-keys';

export default function (obj = {}) {
  return getAllKeys(obj, { enumerable: true }).reduce((prev, curr) => {
    prev[curr] = Object.getOwnPropertyDescriptor(obj, curr);
    return prev;
  }, {});
}
