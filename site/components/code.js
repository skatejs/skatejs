/** @jsx h */

import { Component, define, props } from "../../src";
import { h } from "./_";

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
