import { Component, scopeCss, scopeNode, withRehydration } from '../utils';
import { define, props } from '../../src';

const css = `
  :host {
    background-color: #333;
    color: white;
    display: block;
    margin: 0;
    padding: 20px 28px;
  }
`;

export const Example = define(
  class Example extends withRehydration(Component) {
    static props = {
      html: props.string
    };
    rendererCallback(renderRoot) {
      scopeNode(this, css);
      renderRoot.innerHTML = `
        <style>${scopeCss(this, css)}</style>
        ${this.html}
      `;
    }
  }
);
