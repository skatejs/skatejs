'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.withRenderer = undefined;

var _shadow = require('./shadow.js');

const withRenderer = (exports.withRenderer = (Base = HTMLElement) => {
  return class extends Base {
    get renderRoot() {
      return super.renderRoot || (0, _shadow.shadow)(this);
    }

    renderer(root, html) {
      if (super.renderer) {
        super.renderer(root, html);
      } else {
        root.innerHTML = html();
      }
    }

    updated(...args) {
      super.updated && super.updated(...args);
      this.rendering && this.rendering();
      this.renderer(this.renderRoot, () => this.render && this.render(this));
      this.rendered && this.rendered();
    }
  };
});
