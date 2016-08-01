import isNativeRegex from 'regex-native-function';

const div = document.createElement('div');
const isNative = (elem, prop) => isNativeRegex.test(elem[prop]);
const isPolyfill = (elem, prop) => !!elem[prop] && !isNative(elem, prop);

// property used to check for shadowDOMv0 support
export const v0ShadowDOMProperty = 'createShadowRoot';

// property used to check for shadowDOMv1 support
export const v1ShadowDOMProperty = 'attachShadow';

export function shouldUseShadowDomV0(elem) {
  if (isNative(elem, v1ShadowDOMProperty)) {
    return false;
  } else if (isNative(elem, v0ShadowDOMProperty)) {
    return true;
  } else if (isPolyfill(elem, v1ShadowDOMProperty)) {
    return false;
  }
  return isPolyfill(elem, v0ShadowDOMProperty);
}

export function shouldUseShadowDomV1(elem) {
  if (isNative(elem, v1ShadowDOMProperty)) {
    return true;
  } else if (isNative(elem, v0ShadowDOMProperty)) {
    return false;
  }
  return isPolyfill(elem, v1ShadowDOMProperty);
}

export const customElementsV0 = !!document.registerElement;
export const customElementsV0Polyfill = customElementsV0 && !Document.prototype.registerElement;
export const customElementsV1 = !!window.customElements;

export const shadowDomV0 = shouldUseShadowDomV0(div);
export const shadowDomV1 = shouldUseShadowDomV1(div);
