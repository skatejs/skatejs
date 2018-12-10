class History {
  constructor() {
    this._history = [];
    this._index = 0;
    this.pushState(null, null, '/');
  }
  get length() {
    return this._history.length;
  }
  get state() {
    return this._current().state;
  }
  back() {
    if (index > 0) {
      this.index--;
      this._update();
      this._dispatch();
    }
  }
  forward() {
    if (index < this.length - 1) {
      this.index++;
      this._update();
      this._dispatch();
    }
  }
  go(rel) {
    const abs = Math.abs(rel);
    const method = rel > 0;
    if (rel > 0) {
      for (let a = 0; a < abs; a++) {
        this.forward();
      }
    } else if (rel < 0) {
      for (let a = 0; a < abs; a++) {
        this.back();
      }
    }
  }
  pushState(state, title, url) {
    this._history.push({
      state,
      title,
      url
    });
    this._update();
  }
  replaceState(state, title, url) {
    this._history.pop();
    this._history.push({
      state,
      title,
      url
    });
    this._update();
  }
  _current() {
    return this._history[this._index];
  }
  _update() {
    window.location.pathname = this._current().url;
  }
  _dispatch() {
    dispatchEvent(
      new Event('popstate', {
        state: this.state
      })
    );
  }
}

module.exports = History;
