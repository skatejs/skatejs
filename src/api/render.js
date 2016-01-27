import registry from '../shared/registry';

export default function (elem) {
  registry.find(elem).forEach(component => component.render && component.render(elem));
}
