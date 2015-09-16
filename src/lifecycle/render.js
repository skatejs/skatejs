export default function lifecycleRender (elem, opts) {
  let temp = opts.render;
  if (temp && !elem.hasAttribute(opts.resolvedAttribute)) {
    temp.call(elem);
  }
}
