export const withState = (
  Base?: Class<HTMLElement> = HTMLElement
): Class<HTMLElement> =>
  class extends Base {
    triggerUpdate: Function | void;
    _state = {};
    get state() {
      return this._state;
    }
    set state(state: Object) {
      this._state = state;
      if (this.triggerUpdate) {
        this.triggerUpdate();
      }
    }
  };
