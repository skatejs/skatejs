import assign from 'object-assign';
import customElements from '../native/custom-elements';
import createElement from '../native/create-element';
import init from './init';
import support from '../native/support';

export default function (name, props) {
  let elem;
  const Ctor = customElements.get(name);

  if (Ctor) {
    if (support.v1) {
      elem = createElement(name, { is: Ctor.extends || null });
    } else if (support.v0) {
      elem = Ctor.extends ? createElement(Ctor.extends, name) : createElement(name);
    } else {
      if (Ctor.extends) {
        elem = createElement(Ctor.extends);
        elem.setAttribute('is', name);
      } else {
        elem = createElement(name);
      }
      init(elem);
    }
  } else {
    elem = createElement(name);
  }

  return assign(elem, props);
}
