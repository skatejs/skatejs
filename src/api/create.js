import assign from '../util/assign';
import registry from '../polyfill/registry';

export default function (name, props) {
  var ctor = registry.get(name);
  return ctor && ctor(props) || assign(document.createElement(name), props);
}
