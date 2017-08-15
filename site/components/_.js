/** @jsx h */

import val from "@skatejs/val";
import hljs from "highlight.js";
import { Component, define, h as preactH, props } from "../../src";

const fs = require("fs");

export const h = val(preactH);

function format(src) {
  // Remove leading newlines and only allow up to two newlines in code.
  src = src.split("\n").filter((v, i, a) => a[i - 1] || v.trim().length);

  // Get the initial indent so we can remove it from subsequent lines.
  const indent = src[0].match(/^\s*/)[0].length;

  // Format indentation.
  src = src.map(s => s.substring(indent));

  // Re-instate newline formatting.
  return hljs.highlightAuto(src.join("\n")).value;
}

export const Code = define(
  class extends Component {
    static props = {
      lang: { ...props.string, ...{ default: "js" } },
      src: props.string,
      theme: { ...props.string, ...{ default: "monokai" } }
    };
    renderCallback({ lang, src, theme }) {
      return (
        <pre>
          <style>{`
            :host {
              background-color: #222;
              color: white;
              display: block;
              padding: 10px 20px;
            }
            ${fs.readFileSync(
              `./node_modules/highlight.js/styles/${theme}.css`
            )}
          `}</style>
          <code class="hljs ${lang}">
            {format(src)}
          </code>
        </pre>
      );
    }
  }
);

export const Heading = ({ children }) =>
  <h1>
    {children}
  </h1>;

export const Hero = define(
  class extends Component {
    renderCallback() {
      return (
        <div>
          <style>{`

          `}</style>
          <slot />
        </div>
      );
    }
  }
);

export const Layout = define(
  class extends Component {
    renderCallback() {
      return <slot />;
    }
  }
);
