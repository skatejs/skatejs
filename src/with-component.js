// @flow

import { h, render } from "preact";
import { withProps } from "./with-props";
import { withRender } from "./with-render";
import { withUnique } from "./with-unique";

const withAll = (Base?: Class<any> = HTMLElement): Class<HTMLElement> =>
  withProps(withRender(withUnique(Base)));

const withPreact = (Base?: Class<any> = HTMLElement): Class<HTMLElement> =>
  class extends Base {
    _preactDom: Object;
    rendererCallback(shadowRoot: Node, renderCallback: () => Object) {
      this._preactDom = render(
        renderCallback(),
        shadowRoot,
        this._preactDom || shadowRoot.children[0]
      );
    }
  };

export const withComponent = withPreact;
export const Component: Class<HTMLElement> = withAll(
  withPreact(typeof window === "undefined" ? class {} : HTMLElement)
);
export { h };
