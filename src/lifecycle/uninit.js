import detached from './detached';
import registry from '../polyfill/registry';

export default function (element) {
  registry.getForElement(element).forEach(function (options) {
    detached(options).call(element);
  });
}
