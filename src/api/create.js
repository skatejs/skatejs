import assign from 'object-assign';
import registry from '../global/registry';

export default function (name, properties) {
  const trimmedName = name.trim();
  const constructor = registry.get(trimmedName);
  return constructor ? constructor(properties) : assign(document.createElement(trimmedName), properties);
}
