import registry from '../global/registry';

var slice = Array.prototype.slice;

export default function (elem, name) {
  var definition = registry.get(name);
  return definition ? slice.call(elem.querySelectorAll(`${definition.type.selector(definition)}`)) : [];
}
