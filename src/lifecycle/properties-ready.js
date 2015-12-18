export default function propertiesApply (elem, properties) {
  Object.keys(properties).forEach(function (name) {
    const prop = properties[name];
    if (typeof prop.ready === 'function') {
      prop.ready(elem, elem[name]);
    }
  });
}
