import Element, { React } from "@skatejs/element-react";
import css from "@skatejs/shadow-css";
import { Code, Link } from "../components";
import { global, shared } from "../styles";
import { AppConsumer } from "../state";

const styles = css`
  ${".content"} {
    max-width: 600px;
  }
  ${".hero"} {
    max-width: 600px;
    margin: ${[0, "auto", 40, "auto"]};
  }
  ${".heroContainer"} {
    padding: 1px 0;
    text-align: center;
  }
  ${".heroCode"} {
    --code-background-color: var(--background-color);
    --code-text-color: var(--hero-background-color);
    display: block;
    margin: var(--grid) auto;
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
  }
  ${".nav"} {
    padding: 15px 0;
    width: 200px;
  }
  ${".nav"} ul {
    list-style: none;
    margin: 0;
    padding: 0;
  }
  ${".nav"} li {
    margin: 0;
    padding: 0;
  }
  ${".pageTitle"} {
    margin: ${[40, 0, 40, 200]};
  }
  ${".separator"} {
    background-color: var(--hero-background-color);
    color: #eee;
    margin: 0 0 var(--grid) 0;
    padding: 0;
  }
`;

export default ({ Component, pageProps, router }) => {
  return (
    <>
      <style>{global.css}</style>
      <style>{shared.css}</style>
      <style>{styles.css}</style>
      <div className={styles.separator}>
        <AppConsumer>
          {({ title }) =>
            router.route === "/" ? (
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
              ""
            )
          }
        </AppConsumer>
        <section className={styles.layout}>
          <section>
            {router.route === "/" ? (
              ""
            ) : (
              <AppConsumer>
                {({ title }) => <h1 className={styles.pageTitle}>{title} </h1>}
              </AppConsumer>
            )}
          </section>
        </section>
      </div>
      <section className={styles.layout}>
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
        <section className={styles.content}>
          <Component props={pageProps} />
        </section>
      </section>
    </>
  );
};
