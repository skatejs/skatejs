// @flow

import { HTMLElement, sym } from './util';
import { generateName } from './util/with-unique';

const _is = sym('_is');

export const withUnique = (Base?: Class<HTMLElement>): Class<HTMLElement> =>
  class extends (Base || HTMLElement) {
    static get is () {
      return this[_is] || (this[_is] = generateName(this));
    }
    static set is (is) {
      this[_is] = is;
    }
  };
