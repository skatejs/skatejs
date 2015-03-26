import registry from '../polyfill/registry';

export default function (callback) {
  return function (element) {
    element = element || this;
    registry.getForElement(element).forEach(callback.bind(null, element));
  };
}
