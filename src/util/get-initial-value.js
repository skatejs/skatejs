//@flow
export default function getInitialValue (elem:any, name:string|Symbol, opts:IPropDef):any {
  return typeof opts.initial === 'function' ? opts.initial(elem, { name }) : opts.initial;
}
