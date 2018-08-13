import { Root } from './types';

export function shadow(elem: HTMLElement & { _shadowRoot?: Root }): Root {
  return (
    elem._shadowRoot ||
    (elem._shadowRoot = elem.shadowRoot || elem.attachShadow({ mode: 'open' }))
  );
}
