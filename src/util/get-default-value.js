export default function getDefaultValue (elem, opts) {
  return typeof opts.default === 'function' ? opts.default(elem, { name: opts.name }) : opts.default;
}
