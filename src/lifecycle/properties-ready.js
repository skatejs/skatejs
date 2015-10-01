export default function propertiesApply (elem, props) {
  Object.keys(props).forEach(function (name) {
    let prop = props[name];
    prop.set && prop.set.call(elem, elem[name]);
  });
}
