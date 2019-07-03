import Element, { React } from "@skatejs/element-react";
import marked from "marked";
import { renderToString } from "react-dom/server";
import { Code } from "./code";
import { Link } from "./link";
import { shared } from "../styles";
import { outdent } from "../util";

const renderer = Object.assign(new marked.Renderer(), {
  code(code, lang) {
    return renderToString(<Code code={code} lang={lang} />);
  },
  heading(text, level) {
    return level === 1 ? "" : `<h${level}>${text}</h${level}>`;
  },
  link(href, something, text) {
    // The text argument may contain HTML. If it does, we need to set the
    // innerHTML directly otherwise it will be escaped. However, in doing
    // this, it prevents it from being server-side rendered. We could fix
    // this in the SSR layer by passing this through, so this is a workaround.
    return renderToString(
      text[0] === "<" ? (
        <Link href={href} dangerouslySetInnerHTML={{ __html: text }} />
      ) : (
        <Link href={href}>{text}</Link>
      )
    );
  }
});

export class Markdown extends Element {
  static props = {
    src: String
  };
  render() {
    const src = outdent(this.src);
    return (
      <>
        <style>{shared.toString()}</style>
        <div
          dangerouslySetInnerHTML={{
            __html: marked(src, { renderer })
          }}
        />
      </>
    );
  }
}
