export default function getInitialValue (elem, opts) {
  return typeof opts.initial === 'function' ? opts.initial(elem, { name: opts.name }) : opts.initial;
}
