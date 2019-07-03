import Element, { React } from "@skatejs/element-react";
import css from "@skatejs/shadow-css";
import { Code, Link, Hero } from "../components";
import { global, shared } from "../styles";

const styles = css`
  ${".content"} {
    max-width: 600px;
  }
  ${".hero"} {
    max-width: 600px;
    margin: 0 auto;
  }
  ${".layout"} {
    display: flex;
    margin: 0 auto;
    max-width: 800px;
  }
  ${".nav"} {
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
`;

export default ({ Component, pageProps, router }) => {
  return (
    <>
      <style>{global.toString()}</style>
      <style>{shared.toString()}</style>
      <style>{styles.toString()}</style>
      {router.route === "/" ? (
        <section className={styles.hero}>
          <Hero />
        </section>
      ) : (
        ""
      )}
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
