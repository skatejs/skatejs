export default function (obj, props) {
  Object.keys(props).forEach(function (name) {
    const desc = Object.getOwnPropertyDescriptor(obj, name);
    if (!desc || desc.configurable) {
      Object.defineProperty(obj, name, props[name]);
    }
  });
}