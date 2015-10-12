import registry from '../global/registry';
import renderer from '../lifecycle/renderer';

export default function (elem) {
  const components = registry.find(elem);
  if (components.length) {
    renderer(elem, components[0]);
  }
}
