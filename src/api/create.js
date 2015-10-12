import assign from '../util/assign';
import registry from '../global/registry';

export default function (name, props) {
  const trimmedName = name.trim();
  const constructor = registry.get(trimmedName);
  return constructor && constructor(props) || assign(document.createElement(trimmedName), props);
}
