import Element, { React } from "@skatejs/element-react";
import css from "@skatejs/shadow-css";
import { Code } from "./code";
import { shared } from "../styles";

const styles = css`
  ${".code"} {
    display: block;
    margin: calc(var(--grid) * 4) auto;
    max-width: 600px;
  }
  ${".hero"} {
    text-align: center;
  }
  ${".subtitle"} {
    font-size: 1.4em;
    margin: calc(var(--grid) * 2) auto;
  }
  ${".title"} {
    margin: calc(var(--grid) * 2) auto;
  }
`;

export class Hero extends Element {
  render() {
    return (
      <>
        <style>{shared.toString()}</style>
        <style>{styles.toString()}</style>
        <section className={styles.hero}>
          <h1 className={styles.title}>SkateJS</h1>
          <h2 className={styles.subtitle}>
            Web components powered by modern view libraries.
          </h2>
        </section>
        <Code
          class={styles.code}
          code={`
            import Element, { React } from "@skatejs/element-react";

            export default class extends Element {
              render() {
                return (
                  <>
                    Hello, <slot />!
                  </>
                );
              }
            }
          `}
        />
      </>
    );
  }
}
