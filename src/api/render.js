import findElementInRegistry from '../util/find-element-in-registry';

export default function (elem) {
  const component = findElementInRegistry(elem);
  if (component && component.render) {
    component.render(elem);
  }
}
