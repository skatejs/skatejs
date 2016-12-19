export default function getInitialValue (elem, propDef) {
  return typeof propDef.initial === 'function'
    ? propDef.initial(elem, { name: propDef.nameOrSymbol })
    : propDef.initial;
}
