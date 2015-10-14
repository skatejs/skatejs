import global from '../util/global';
export default function () {
  return global.document && typeof document.registerElement === 'function';
}
