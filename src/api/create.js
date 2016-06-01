import assign from 'object-assign';
import customElements from '../native/custom-elements';

export default function (name, props) {
  const Ctor = customElements.get(name);
  return Ctor ? Ctor(props) : assign(document.createElement(name), props);
}
