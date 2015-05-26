export default function (obj, key) {
  return Object.prototype.hasOwnProperty.call(obj, key);
}
