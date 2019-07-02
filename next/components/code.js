// @jsx h

import Element, { h } from "@skatejs/element-react";
import css from "@skatejs/shadow-css";
// import { Tabs } from "./tabs";
// import theme from "css-loader!prismjs/themes/prism-twilight.css";

const values = obj => Object.values(obj);

function format(src) {
  src = src || "";

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

const cssCode = css`
  ${".code"} {
    background-color: #333;
    line-height: 1.2em;
    font-size: 1.2em;
    margin: 0;
    overflow: auto;
    padding: 20px;
  }
  ${".host"} {
    border-radius: 4px;
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
    lang: String,
    title: String
  };

  refHighlight = e => {
    if (!e) return;
    import("prismjs").then(prism => {
      e.innerHTML = prism.highlight(
        format(this.innerHTML),
        prism.languages[this.lang] || prism.languages.markup,
        this.lang || "markup"
      );
    });
  };

  render() {
    return (
      <div className={cssCode.host}>
        {/* <style>{theme}</style> */}
        <style>{cssCode.toString()}</style>
        {this.title ? <div className={cssCode.title}>{this.title}</div> : null}
        <div className={cssCode.code}>
          <pre className={cssCode.pre}>
            <slot />
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
