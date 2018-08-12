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
      this._preactDom = render(
        call(),
        root,
        this._preactDom || root.childNodes[0]
      );
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
