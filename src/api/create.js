import customElements from '../native/custom-elements';

export default function (name) {
  const Ctor = customElements.get(name);
  return Ctor ? new Ctor() : document.createElement(name);
}
