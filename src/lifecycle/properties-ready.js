export default function propertiesApply (elem, props) {
  Object.keys(props).forEach(function (name) {
    let ready = props[name].ready;
    ready && ready(elem, elem[name]);
  });
}
