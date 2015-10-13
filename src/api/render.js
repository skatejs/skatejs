import registry from '../global/registry';
import renderer from '../lifecycle/renderer';

export default function (elem) {
  registry.find(elem).forEach(component => renderer(elem, component));
}
