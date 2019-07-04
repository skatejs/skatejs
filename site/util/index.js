import Element, { React } from "@skatejs/element-react";
import { Markdown } from "../components";

function parseValue(str, value, props) {
  if (Array.isArray(value)) {
    const indent = str
      .split("\n")
      .pop()
      .match(/^\s*/)[0];
    return value.map(v => parseValue(str, v, props)).join(`\n${indent}`);
  }
  if (value && value.renderToString) {
    return value.renderToString();
  }
  if (typeof value === "function") {
    return parseValue(str, value(props), props);
  }
  return value;
}

export function md(strings, ...replacements) {
  if (typeof strings === "string") {
    strings = [strings];
  }
  return class extends Element {
    static get props() {
      return {
        props: Object
      };
    }
    render() {
      const src =
        replacements.reduce((prev, next, i) => {
          return prev + strings[i] + parseValue(strings[i], next, this.props);
        }, "") + strings[strings.length - 1];
      return <Markdown src={src} />;
    }
  };
}

export function outdent(strings, ...replacements) {
  if (typeof strings === "string") {
    strings = [strings];
  }

  let src =
    strings.map((s, i) => s + (replacements[i] || "")) +
    (replacements.pop() || "");

  // Remove leading newlines and only allow up to two newlines in code.
  src = src.split("\n").filter((v, i, a) => a[i - 1] || v.trim().length);

  // Get the initial indent so we can remove it from subsequent lines.
  const indent = src[0] ? src[0].match(/^\s*/)[0].length : 0;

  // Format indentation.
  src = src.map(s => s.substring(indent));

  // Re-instate newline formatting.
  src = src.join("\n");

  return src;
}
