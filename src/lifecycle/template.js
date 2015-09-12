export default function lifecycleTemplate (elem, opts) {
  let temp = opts.template;
  if (temp && !elem.hasAttribute(opts.resolvedAttribute)) {
    temp.call(elem);
  }
}
