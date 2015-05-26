import registry from '../polyfill/registry';

export default function (name) {
  var Ctor = registry.get(name);
  return Ctor && new Ctor() || document.createElement(name);
}
