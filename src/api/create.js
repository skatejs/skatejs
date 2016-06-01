import customElements from '../native/custom-elements';
import init from './init';
import support from '../native/support';

export default function (name) {
  let elem;
  const Ctor = customElements.get(name);

  if (Ctor) {
    if (support.v1) {
      elem = document.createElement(name, { is: Ctor.extends || null });
    } else if (support.v0) {
      elem = Ctor.extends ? document.createElement(Ctor.extends, name) : document.createElement(name);
    } else {
      if (Ctor.extends) {
        elem = document.createElement(Ctor.extends);
        elem.setAttribute('is', name);
      } else {
        elem = document.createElement(name);
      }
      init(elem);
    }
  } else {
    elem = document.createElement(name);
  }

  return elem;
}
