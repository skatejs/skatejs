import { name as $name } from '../util/symbols';

function resolveTagName(tname) {
  // If the tag name is a function, a Skate constructor or a standard function
  // is supported.
  //
  // - If a Skate constructor, the tag name is extracted from that.
  // - If a standard function, it is used as a helper.
  if (typeof tname === 'function') {
    return tname[$name] || tname;
  }

  // All other tag names are just passed through.
  return tname;
}

// Normalises attributes for all Hyperscript style interfaces.
function createElement(adapter, tname, attrs, ...chren) {
  const atype = typeof attrs;
  tname = resolveTagName(tname);

  // If attributes are a function, then they should be treated as children.
  if (atype === 'function' || atype === 'string' || atype === 'number') {
    chren = [attrs];
  }

  // Ensure the attributes are an object. Null is considered an object so we
  // have to test for this explicitly.
  if (attrs === null || atype !== 'object') {
    attrs = {};
  }

  return adapter(tname, attrs, ...chren);
}

// Even further convenience for building a DSL out of JavaScript functions or hooking into standard
// transpiles for JSX (React.createElement() / h).
export default function vdom(adapter, ...tags) {
  if (tags.length === 0) {
    return (...args) => createElement.bind(null, adapter, ...args);
  }
  return tags.map(tag =>
    (...args) =>
      createElement.bind(null, adapter, tag, ...args)
  );
}
