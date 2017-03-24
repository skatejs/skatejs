import { HTMLElement, sym, uniqueId } from './util';

const _is = sym();

export function withUnique (Base = HTMLElement) {
  return class extends Base {
    static get is () {
      return this[_is] || (this[_is] = `x-${uniqueId().substring(0, 8)}`);
    }
    static set is (is) {
      this[_is] = is;
    }
  };
}
