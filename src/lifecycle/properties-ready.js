export default function propertiesApply (elem, properties) {
  Object.keys(properties).forEach(function (name) {
    properties[name].ready.call(elem);
  });
}
