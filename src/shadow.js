export function shadow(elem) {
  return (
    elem._shadowRoot ||
    (elem._shadowRoot = elem.shadowRoot || elem.attachShadow({ mode: 'open' }))
  );
}
