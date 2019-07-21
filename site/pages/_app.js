import Element, { React } from "@skatejs/element-react";
import css from "@skatejs/shadow-css";
import { Code, Link } from "../components";
import { global, shared } from "../styles";
import { AppConsumer } from "../state";

const styles = css`
  ${".hero"} {
    margin: auto;
    max-width: 600px;
  }
  ${".heroContainer"} {
    padding: 1px 0;
    text-align: center;
  }
  ${".heroCode"} {
    --code-background-color: var(--background-color);
    --code-text-color: var(--hero-background-color);
  }
  ${".heroSubtitle"} {
    font-size: 1.4em;
    margin: calc(var(--grid) * 2) auto;
  }
  ${".heroTitle"} {
    margin: calc(var(--grid) * 2) auto;
  }
  ${".layout"} {
    display: flex;
    margin: 0 auto;
    max-width: 800px;
    padding: 20px;
  }
  ${".nav"} {
    margin: 0;
    padding: 0;
  }
  ${".nav"} ul {
    list-style: none;
    margin: auto;
    padding: 0;
  }
  ${".nav"} li {
    display: inline-block;
    margin: 0 20px 0 0;
  }
  ${".nav"} li:last-of-type {
    margin: 0;
  }
  ${".pageTitle"} {
    margin: var(--grid) 0;
  }
  ${".separator"} {
    background-color: var(--hero-background-color);
    color: #eee;
    padding: 20px;
  }
`;

export default ({ Component, pageProps, router }) => {
  return (
    <>
      <style>{global.css}</style>
      <style>{shared.css}</style>
      <style>{styles.css}</style>
      <div className={styles.separator}>
        <nav className={styles.nav}>
          <ul>
            <li>
              <Link href="/">Home</Link>
            </li>
            <li>
              <Link href="/docs">Docs</Link>
            </li>
            <li>
              <Link href="/guides">Guides</Link>
            </li>
          </ul>
        </nav>
        {router.route === "/" ? (
          <section className={styles.hero}>
            <section className={styles.heroContainer}>
              <h1 className={styles.heroTitle}>SkateJS</h1>
              <h2 className={styles.heroSubtitle}>
                Web components powered by modern view libraries.
              </h2>
            </section>
            <Code
              class={styles.heroCode}
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
          </section>
        ) : (
          <AppConsumer>
            {({ title }) => <h1 className={styles.pageTitle}>{title}</h1>}
          </AppConsumer>
        )}
      </div>
      <section className={styles.layout}>
        <Component props={pageProps} />
      </section>
    </>
  );
};
