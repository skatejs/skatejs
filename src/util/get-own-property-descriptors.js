export default function (obj) {
  return Object.getOwnPropertyNames(obj || {}).reduce((prev, curr) => {
    prev[curr] = Object.getOwnPropertyDescriptor(obj, curr);
    return prev;
  }, {});
}
