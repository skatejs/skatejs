class PatchedEvent extends Event {
  constructor(evnt, opts = {}) {
    super(evnt, opts);
    Object.assign(this, opts);
  }
  initEvent(type, bubbles, cancelable) {
    this.bubbles = bubbles;
    this.cancelable = cancelable;
    this.type = type;
  }
  initCustomEvent(type, bubbles, cancelable, detail) {
    this.initEvent(type, bubbles, cancelable);
    this.detail = detail;
  }
}

module.exports = PatchedEvent;
