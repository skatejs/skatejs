// @flow

export function shadow(elem: HTMLElement) {
  return (
    // $FlowFixMe - _shadowRoot isn't in HTMLElement
    elem._shadowRoot ||
    // $FlowFixMe - _shadowRoot isn't in HTMLElement
    (elem._shadowRoot = elem.shadowRoot || elem.attachShadow({ mode: 'open' }))
  );
}
