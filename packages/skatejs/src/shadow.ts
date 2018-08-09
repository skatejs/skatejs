export function shadow(elem: HTMLElement & { _shadowRoot?: Node }): Node {
  return (
    elem._shadowRoot ||
    (elem._shadowRoot = elem.shadowRoot || elem.attachShadow({ mode: 'open' }))
  );
}
