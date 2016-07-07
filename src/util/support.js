const div = document.createElement('div');
export const customElementsV0 = !!document.registerElement;
export const customElementsV0Polyfill = !Document.prototype.registerElement;
export const customElementsV1 = !!window.customElements;
export const shadowDomV0 = !!div.createShadowRoot;
export const shadowDomV1 = !!div.attachShadow;
