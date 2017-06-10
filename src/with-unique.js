// @flow

import { generateName } from './util/with-unique';

export const withUnique = (Base?: Class<HTMLElement>): Class<HTMLElement> =>
  class extends (Base || HTMLElement) {
    static _is: string;

    static get is () {
      return this._is || (this._is = generateName(this));
    }
    static set is (is: string) {
      this._is = is;
    }
  };
