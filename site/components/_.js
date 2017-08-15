/** @jsx h */

import val from "@skatejs/val";
import { Component, define, h as preactH, props } from "../../src";

export const h = val(preactH);

function format(src) {
  // Format HTML so it displays.
  src = src.replace(/</g, "&lt;");
  src = src.replace(/>/g, "&gt;");

  // Remove leading newlines and only allow up to two newlines in code.
  src = src.split("\n").filter((v, i, a) => a[i - 1] || v.trim().length);

  // Get the initial indent so we can remove it from subsequent lines.
  const indent = src[0].match(/^\s*/)[0].length;

  // Format indentation.
  src = src.map(s => s.substring(indent));

  // Re-instate newline formatting.
  return src.join("\n");
}

export const Code = define(
  class extends Component {
    static props = {
      src: props.string
    };
    renderCallback({ src }) {
      return (
        <pre>
          <style>{`
            :host { display: block }
          `}</style>
          <code>
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
