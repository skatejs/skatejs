import registry from '../shared/registry';

export default function (elem) {
  const component = registry.find(elem);
  if (component && component.render) {
    component.render(elem);
  }
}
