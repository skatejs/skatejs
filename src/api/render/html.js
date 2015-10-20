import fragment from '../fragment';

export default function (render) {
  return function (elem) {
    while (elem.childNodes.length) {
      elem.removeChild(elem.childNodes[0]);
    }
    elem.appendChild(fragment(render(elem)));
  };
}
