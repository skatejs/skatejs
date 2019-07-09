import Element, { React } from "@skatejs/element-react";
import css, { cx } from "@skatejs/shadow-css";
import { outdent } from "../util";
// import { Tabs } from "./tabs";
// import theme from "css-loader!prismjs/themes/prism-twilight.css";

const styles = css`
  ${".code"} {
    background-color: #333;
    color: #eee;
    line-height: 1.2em;
    margin: 0;
    overflow: auto;
    padding: 20px;
  }
  ${".host"} {
    border-radius: 5px;
    box-shadow: 1px 1px var(--grid) rgba(0, 0, 0, 0.5);
    margin: var(--grid) 0;
    overflow: hidden;
  }
  ${".pre"} {
    margin: 0;
    padding: 0;
  }
  ${".title"} {
    background-color: #20232a;
    padding: 10px 20px;
  }
`;

export class Code extends Element {
  static props = {
    code: String,
    css: Object,
    lang: String,
    title: String
  };

  css = this.css || {};

  render() {
    if (typeof window === "undefined") {
      console.log(this.css);
    }
    return (
      <div className={styles.host}>
        {/* <style>{theme}</style> */}
        <style>{styles.css}</style>
        <style>{this.css.css}</style>
        {this.title ? <div className={styles.title}>{this.title}</div> : null}
        <div className={cx(styles.code, this.css.code)}>
          <pre className={styles.pre}>
            {this.code ? outdent(this.code) : <slot />}
          </pre>
        </div>
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
