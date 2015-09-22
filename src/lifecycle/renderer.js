export default function renderer (elem, opts) {
  let render = opts.render;
  let rendered;
  let renderer = opts.renderer;

  if (elem.hasAttribute(opts.resolvedAttribute)) {
    return;
  }

  rendered = render && render(elem);

  if (renderer) {
    renderer(elem, rendered);
  } else if (rendered) {
    elem.innerHTML = rendered;
  }
}
