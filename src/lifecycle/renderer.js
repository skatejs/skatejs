const defaultRenderer = function (elem, render) {
  elem.innerHTML = render();
};

export default function renderer (opts) {
  let render = opts.render ? opts.render.bind(opts) : null;
  let renderer = opts.renderer ? opts.renderer.bind(opts) : defaultRenderer;
  let resolvedAttribute = opts.resolvedAttribute;

  return function (elem) {
    if (render && !elem.hasAttribute(resolvedAttribute)) {
      renderer(elem, render);
    }
  };
}
