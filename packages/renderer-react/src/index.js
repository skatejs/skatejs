import React from 'react';
import { render } from 'react-dom';

export default (Base = HTMLElement) =>
  class extends Base {
    get props() {
      // We override props so that we can satisfy most use
      // cases for children by using a slot.
      return {
        ...super.props,
        ...{ children: <slot /> }
      };
    }
    rendererCallback(renderRoot, renderCallback) {
      render(renderCallback(), renderRoot);
    }
  };
