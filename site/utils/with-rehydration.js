const isBrowser = typeof process === 'object' && process.browser;
const div = document.createElement('div');

function esc(str) {
  return escape(str ? JSON.stringify(str) : '');
}

function usc(str) {
  return str ? JSON.parse(unescape(str)) : '';
}

export const withRehydration = (Base = HTMLElement) =>
  class extends Base {
    _rehydrates = true;
    connectedCallback() {
      if (super.connectedCallback) {
        super.connectedCallback();
      }
      if (isBrowser) {
        this.props = usc(this.getAttribute('props'));
        this.state = usc(this.getAttribute('state'));
        this.removeAttribute('props');
        this.removeAttribute('state');
      }
    }
    renderedCallback() {
      if (super.renderedCallback) {
        super.renderedCallback();
      }
      if (!isBrowser) {
        this.setAttribute('props', esc(this.props));
        this.setAttribute('state', esc(this.state));
      }
    }
  };
