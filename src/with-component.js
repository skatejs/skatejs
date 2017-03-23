import { render } from 'preact';
import { withRender } from './with-render';

export function withComponent (Base = withRender()) {
  return class extends Base {
    rendererCallback (host, vdom) {
      this._root = render(vdom, host, this._root);
    }
  };
}

export const Component = withComponent();
export { h } from 'preact';
