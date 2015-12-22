import fragment from '../fragment';

export default function (render) {
  return function (elem) {
    const rendered = render(elem);
    while (elem.childNodes.length) {
      elem.removeChild(elem.childNodes[0]);
    }
    elem.appendChild(fragment(rendered));
  };
}
