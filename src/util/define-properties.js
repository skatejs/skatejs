export default function (obj, props) {
  Object.keys(props).forEach(function (name) {
    const prop = props[name];
    const descriptor = Object.getOwnPropertyDescriptor(obj, name);
    const isDinosaurBrowser = name !== 'arguments' && name !== 'caller' && 'value' in prop;
    const isConfigurable = !descriptor || descriptor.configurable;
    const isWritable = !descriptor || descriptor.writable;

    if (isConfigurable) {
      Object.defineProperty(obj, name, prop);
    } else if (isDinosaurBrowser && isWritable) {
      obj[name] = prop.value;
    }
  });
}
