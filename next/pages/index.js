/* @jsx h */

import Element, { h } from "@skatejs/element-react";
import css from "@skatejs/shadow-css";
import { Code, Markdown } from "../components";
import { global, shared } from "../styles";
import { outdent } from "../util";
import pkg from "../../package.json";
import readme from "raw-loader!../../README.md";

const styles = css`
  ${".code"} {
    display: block;
    margin: 0 auto;
    overflow: hidden;
    max-width: 600px;
  }
  ${".hero"} {
    margin: 60px 0;
    text-align: center;
  }
  ${".layout"} {
    margin: 0 auto;
    max-width: 800px;
  }
  ${".subtitle"} {
    font-size: 1.4em;
    margin-top: 30px;
  }
  ${".title"} {
    margin-bottom: 30px;
  }
`;

export default () => (
  <div className={styles.layout}>
    <style>{global.toString()}</style>
    <style>{shared.toString()}</style>
    <style>{styles.toString()}</style>
    <div className={styles.hero}>
      <h1 className={styles.title}>SkateJS</h1>
      <h2 className={styles.subtitle}>
        Web components powered by modern view libraries.
      </h2>
    </div>
    <Code
      class={styles.code}
      code={`
        // @jsx h

        import Element, { g } from "@skatejs/element-react";
        
        export default class extends Element {
          render() {
            return (
              <span>
                Hello, <slot />!
              </span>
            );
          }
        }
      `}
    />
    <Markdown src={readme} />
  </div>
);
