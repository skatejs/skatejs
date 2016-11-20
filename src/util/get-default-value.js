//@flow
export default function getDefaultValue (elem:any, name:string|Symbol, opts:IPropDef):any {
  return typeof opts.default === 'function' ? opts.default(elem, { name }) : opts.default;
}
