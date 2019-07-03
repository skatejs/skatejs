import SkateElement from "@skatejs/element";
import jsx from "@skatejs/jsx";
import OgReact from "react";
import { render } from "react-dom";
import { renderToString } from "react-dom/server";

export default class extends SkateElement {
  disconnectedCallback() {
    if (super.disconnectedCallback) {
      super.disconnectedCallback();
    }
    render(null, this.renderRoot as Element);
  }
  renderer() {
    render(this.render(), this.renderRoot as Element);
  }
  renderToString() {
    return renderToString(this.render());
  }
}

export const h = jsx(OgReact.createElement);
export const React = { ...OgReact, createElement: h };
