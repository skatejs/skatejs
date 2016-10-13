import { name as $name } from '../util/symbols';

// Normalises attributes for all Hyperscript style interfaces.
export default function vdom (adapter, tname, attrs, ...chren) {
  const atype = typeof attrs;
  tname = tname[$name] || tname.tagName || tname;

  // If attributes are a function, then they should be treated as children.
  if (atype === 'function' || atype === 'string' || atype === 'number') {
    chren.unshift(attrs);
  }

  // Ensure the attributes are an object. Null is considered an object so we
  // have to test for this explicitly.
  if (attrs === null || atype !== 'object') {
    attrs = {};
  }

  return adapter(tname, attrs, ...chren);
}