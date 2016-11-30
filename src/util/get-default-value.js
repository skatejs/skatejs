export default function getDefaultValue (elem, propDef) {
  return typeof propDef.default === 'function'
    ? propDef.default(elem, { name: propDef.name })
    : propDef.default;
}
