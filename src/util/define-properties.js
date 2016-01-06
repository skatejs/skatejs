export default function (obj, props) {
  Object.keys(props).forEach(function (name) {
    const prop = props[name];
    const descrptor = Object.getOwnPropertyDescriptor(obj, name);
    const isDinosaurBrowser = name !== 'arguments' && name !== 'caller' && 'value' in prop;
    const isConfigurable = !descrptor || descrptor.configurable;

    if (isConfigurable) {
      Object.defineProperty(obj, name, prop);
    } else if (isDinosaurBrowser) {
      obj[name] = prop.value;
    }
  });
}
