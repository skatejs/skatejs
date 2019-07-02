/* @jsx h */

import Element, { h } from "@skatejs/element-react";
import css from "@skatejs/shadow-css";
import { Code } from "../components";
import { global, shared } from "../styles";
import { outdent } from "../util";

const styles = css`
  ${".code"} {
    color: #eee;
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
    max-width: 1000px;
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
        Effortless custom elements for modern view libraries.
      </h2>
    </div>
    <Code class={styles.code}>
      {outdent`
        // @jsx h

        import Element, { h } from "@skatejs/element-react";
        import { render } from "react-dom";
        import css from "@skatejs/shadow-css";

        const style = css\`
          \${".app"} {
            border: 1px solid black;
            display: inline-block;
            padding: 10px;
          }
        \`;

        class Hello extends Element {
          render() {
            return (
              <div className={style.app}>
                <style>{style.toString()}</style>
                Hello, <slot />!
              </div>
            );
          }
        }

        render(<Hello />, window.app);
      `}
    </Code>
  </div>
);
