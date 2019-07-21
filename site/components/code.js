import Element, { React } from "@skatejs/element-react";
import css, { cx } from "@skatejs/shadow-css";
import { outdent } from "../util";
// import { Tabs } from "./tabs";
import { highlight, languages } from "prismjs";
import theme from "css-loader!prismjs/themes/prism.css";

const styles = css`
  ${".host"} {
    border-radius: 5px;
    box-shadow: 1px 1px var(--grid) rgba(0, 0, 0, 0.5);
    background-color: var(--code-background-color, #333);
    box-sizing: border-box;
    color: var(--code-text-color, #eee);
    overflow: auto;
  }
  ${".pre"} {
    margin: 0 -40px 0 0;
    padding: 20px;
  }
  ${".title"} {
    background-color: #20232a;
    padding: 10px 20px;
  }
  .token.operator {
    background-color: transparent;
  }
`;

export class Code extends Element {
  static props = {
    code: String,
    lang: String,
    title: String
  };

  lang = this.lang || "js";

  render() {
    return (
      <div className={styles.host}>
        <style>{theme}</style>
        <style>{styles.css}</style>
        {this.title ? <div className={styles.title}>{this.title}</div> : null}
        {languages[this.lang] ? (
          <pre
            className={styles.pre}
            dangerouslySetInnerHTML={{
              __html: highlight(
                outdent(this.code),
                languages[this.lang],
                this.lang
              )
            }}
          />
        ) : (
          <pre className={styles.pre}>{outdent(this.code)}</pre>
        )}
      </div>
    );
  }
}

// export class Example extends Component {
//   static props = {
//     html: String,
//     title: String
//   };

//   css = `
//     .code {
//       background-color: #292D34;
//       color: white;
//       margin: 0;
//       overflow: auto;
//       padding: 20px;
//     }
//     .title {
//       background-color: #20232A;
//       color: #eee;
//       font-size: .8em;
//       padding: 10px 20px;
//     }
//   `;

//   connectedCallback() {
//     super.connectedCallback();
//     this.style.display = "block";
//   }

//   render() {
//     return (
//       <div>
//         {this.renderStyle()}
//         {this.title ? <div class="title">{this.title}</div> : ""}
//         <div
//           class="code"
//           ref={e => {
//             e && (e.innerHTML = this.html);
//           }}
//         />
//       </div>
//     );
//   }
// }

// export class Runnable extends Component {
//   static props = {
//     code: String,
//     html: String
//   };

//   connectedCallback() {
//     super.connectedCallback();
//     this.style.display = "block";
//   }

//   render() {
//     return (
//       <Tabs
//         css={`
//           .tabs {
//             border-bottom: none;
//           }
//           .tabs a {
//             border-bottom: none;
//           }
//           .tabs a.selected,
//           .tabs a:hover {
//             background-color: #292d34;
//             border-bottom: none;
//             color: #eee;
//           }
//         `}
//         items={[
//           {
//             name: "Code",
//             pane: <Code code={this.code} lang="js" />
//           },
//           {
//             name: "HTML",
//             pane: this.html ? <Code code={this.html} lang="html" /> : ""
//           },
//           {
//             name: "Result",
//             pane: this.html ? <Example html={this.html} /> : ""
//           }
//         ]}
//       />
//     );
//   }
// }
