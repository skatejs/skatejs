import fragment from '../api/fragment';

const defaultRenderer = function (elem, render) {
  while (elem.childNodes.length) {
    elem.removeChild(elem.childNodes[0]);
  }
  elem.appendChild(fragment(render()));
};

export default function renderer (opts) {
  let render = opts.render ? opts.render : null;
  let renderer = opts.renderer ? opts.renderer.bind(opts) : defaultRenderer;
  let resolvedAttribute = opts.resolvedAttribute;

  return function (elem) {
    if (render && !elem.hasAttribute(resolvedAttribute)) {
      renderer(elem, render.bind(opts, elem));
    }
  };
}
