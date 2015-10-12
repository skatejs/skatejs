import fragment from '../api/fragment';

function defaultRenderer (elem, opts) {
  while (elem.childNodes.length) {
    elem.removeChild(elem.childNodes[0]);
  }
  elem.appendChild(fragment(opts.render(elem)));
}

export default function (elem, opts) {
  if (opts.render) {
    if (opts.renderer) {
      opts.renderer(elem);
    } else {
      defaultRenderer(elem, opts);
    }
  }
}
