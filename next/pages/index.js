/* @jsx h */

import Element, { h } from "@skatejs/element-react";
import css from "@skatejs/shadow-css";
import { Code } from "../components";

const style = css`
  :root {
    --background-color: #262434;
    --background-color-highlight: #2b273d;
    --font-family: helvetica;
    --font-size: 1em;
    --grid: 20px;
    --line-height: 1.4em;
    --pill-color-start: #fdf96f;
    --pill-color-end: #e94ca2;
    --tab-color-start: #ec56b0;
    --tab-color-end: #6ce9f5;
    --text-color: #a6a3ab;
  }
  body {
    background-color: var(--background-color);
    color: var(--text-color);
    font-family: var(--font-family);
    font-size: var(--font-size);
    line-height: var(--line-height);
    margin: 0;
    padding: 0;
  }
  h1 {
    display: block;
    font-weight: normal;
    margin: calc(var(--grid) * 2);
    text-align: center;
  }
`;

const styleBox = css`
  ${".host"} {
    display: inline-block;
    width: 20%;
  }
`;

class Box extends Element {
  render() {
    return (
      <div className={styleBox.host}>
        <style>{styleBox.toString()}</style>
        <slot />
      </div>
    );
  }
}

const styleLayout = css`
  ${".host"} {
    margin: 0 auto;
    max-width: 1000px;
  }
`;

class Layout extends Element {
  render() {
    return (
      <div className={styleLayout.host}>
        <style>{styleLayout.toString()}</style>
        <slot />
      </div>
    );
  }
}

function code(strings) {
  let src = strings.join("");

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

export default () => (
  <Layout>
    <style>{style.toString()}</style>
    <h1>SkateJS</h1>
    <Code>
      {code`
        // @jsx h

        import Element, { h } from "@skatejs/element-react";

        export default class extends Element {
          render() {
            return (
              <p>Hello, <slot />!</p>
            );
          }
        }
      `}
    </Code>
  </Layout>
);
