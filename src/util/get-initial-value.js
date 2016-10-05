export default function getInitialValue(elem, name, opts) {
  return typeof opts.initial === 'function' ? opts.initial(elem, { name }) : opts.initial;
}
