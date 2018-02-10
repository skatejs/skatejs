/* @jsx h */

import { h, render } from 'preact';

const withReactLike = (Base = HTMLElement) =>
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
      render(call(), root);
    }
  };

export default withReactLike;

export function wrap(ReactLikeComponent, Base = HTMLElement) {
  return class extends withReactLike(Base) {
    render({ props }) {
      return <ReactLikeComponent {...props} />;
    }
  };
}
