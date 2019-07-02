/* @jsx h */

import define, { getName } from "@skatejs/define";
import Element, { h } from "@skatejs/element-react";
import marked from "marked";
import React from "react";
import { renderToString } from "react-dom/server";
import { Code } from "./code";
import { shared } from "../styles";

const renderer = Object.assign(new marked.Renderer(), {
  code(code, lang) {
    return renderToString(<Code code={code} lang={lang} />);
  },
  heading(text, level) {
    return level === 1 ? "" : `<h${level}>${text}</h${level}>`;
  }
});

export class Markdown extends Element {
  static props = {
    src: String
  };
  render() {
    return (
      <>
        <style>{shared.toString()}</style>
        <div
          dangerouslySetInnerHTML={{ __html: marked(this.src, { renderer }) }}
        />
      </>
    );
  }
}
