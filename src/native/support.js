export const customElementsV0 = 'registerElement' in document;
export const customElementsV1 = 'customElements' in window;
export const shadowDomV0 = 'createShadowRoot' in Element.prototype;
export const shadowDomV1 = 'attachShadow' in Element.prototype;
