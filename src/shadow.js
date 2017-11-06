const defs = { mode: 'open' };

export function shadow(elem, opts = {}) {
  return (
    elem._shadowRoot ||
    (elem._shadowRoot =
      elem.shadowRoot || elem.attachShadow({ ...defs, ...opts }))
  );
}
