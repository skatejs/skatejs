import { root } from './util';

const { HTMLElement = class {} } = root;

export function withRaw (Base = HTMLElement) {
  return class extends Base {
    static is = null
    static observedAttributes = []
    attributeChangedCallback () {}
    connectedCallback () {}
    disconnectedCallback () {}
  };
}
