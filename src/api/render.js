import customElements from '../native/custom-elements';

export default function (elem) {
  const component = customElements.get(elem.tagName.toLowerCase());
  if (component && component.render) {
    component.render(elem);
  }
}
