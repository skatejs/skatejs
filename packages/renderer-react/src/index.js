import React from 'react';
import { render, unmountComponentAtNode } from 'react-dom';

const withReact = (Base = HTMLElement) =>
  class extends Base {
    get props() {
      // We override props so that we can satisfy most use
      // cases for children by using a slot.
      return {
        ...super.props,
        ...{ children: <slot /> }
      };
    }
    renderer(root, call) {
      this._renderRoot = root;
      render(call(), root);
    }
    disconnectedCallback() {
      super.disconnectedCallback && super.disconnectedCallback();
      if (this._renderRoot) {
        unmountComponentAtNode(this._renderRoot);
        this._renderRoot = null;
      }
    }
  };

export default withReact;

export const wrap = Component =>
  class extends withReact() {
    render() {
      return <Component {...this.props} />;
    }
  };
