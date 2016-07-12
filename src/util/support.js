import isNativeRegex from 'regex-native-function'; // checks if a function is native using regex
import { v0ShadowDOMProperty, v1ShadowDOMProperty } from '../api/symbols';

const div = document.createElement('div');
const isNative = (elem, prop) => isNativeRegex.test(elem[prop]);
const isPolyfill = (elem, prop) => !!elem[prop] && !isNative(elem, prop);

export function shouldUseShadowDomV0(elem) {
  if (isNative(elem, v1ShadowDOMProperty)) {
    return false;
  } else if (isPolyfill(elem, v1ShadowDOMProperty) && isNative(elem, v0ShadowDOMProperty)) {
    return true;
  } else if (!isPolyfill(elem, v1ShadowDOMProperty) && isNative(elem, v0ShadowDOMProperty)) {
    return true;
  } else {
    return false;
  }
}

export function shouldUseShadowDomV1(elem) {
  if (isNative(elem, v1ShadowDOMProperty)) {
    return true;
  } else if (isPolyfill(elem, v1ShadowDOMProperty) && isNative(elem, v0ShadowDOMProperty)) {
    return false;
  } else if (isPolyfill(elem, v1ShadowDOMProperty)) {
    return true;
  } else {
    return false;
  }
}

export const customElementsV0 = !!document.registerElement;
export const customElementsV1 = !!window.customElements;

export const shadowDomV0 = shouldUseShadowDomV0(div);
export const shadowDomV1 = shouldUseShadowDomV1(div);
