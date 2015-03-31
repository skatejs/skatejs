import attached from './attached';
import created from './created';
import registry from '../polyfill/registry';

function callCallback (element, callback) {
  return function (options) {
    callback(options).call(element);
  };
}

export default function (element) {
  var components = registry.getForElement(element);
  components.forEach(callCallback(element, created));
  components.forEach(callCallback(element, attached));
}
