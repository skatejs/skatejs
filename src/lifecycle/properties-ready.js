export default function propertiesApply (elem, properties) {
  Object.keys(properties).forEach(function (name) {
    let prop = properties[name];
    prop.set && prop.set.call(elem, elem[name]);
  });
}
