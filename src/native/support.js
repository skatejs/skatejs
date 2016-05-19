const v0 = !!document.registerElement;
const v1 = !!window.customElements;
const polyfilled = !v0 && !v1;
const shadowDomV0 = !!('createShadowRoot' in Element.prototype);
const shadowDomV1 = !!('attachShadow' in Element.prototype);

export default {
  v0,
  v1,
  polyfilled ,
  shadowDomV0,
  shadowDomV1
};
