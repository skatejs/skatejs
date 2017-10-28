// @flow

import type { WithState } from './types';

export const withState = (Base: Class<any> = HTMLElement): Class<WithState> =>
  class extends Base {
    _state = {};
    get state() {
      return this._state;
    }
    set state(state: Object) {
      this._state = state;
      this.triggerUpdate && this.triggerUpdate();
    }
  };
