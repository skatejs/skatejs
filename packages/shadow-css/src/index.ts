import { getName } from "@skatejs/define";

const cache = {};
const native =
  typeof customElements !== "undefined" &&
  customElements.define.toString().indexOf("native code") > -1;
const regexClassName = /^\s*\.([a-zA-Z0-9]+)/g;
const regexHostBare = /:host([\s\{])/g;
const regexHostContext = /:host-context\(([^)]+)\)/g;
const regexHostSelector = /:host\(([^)]+)\)/g;

function parse(id, css) {
  if (!cache[id]) {
    cache[id] = {};
  }

  if (cache[id][css]) {
    return cache[id][css];
  }

  let parsed = css;

  parsed = parsed.replace(regexClassName, `${id} .$1`);
  parsed = parsed.replace(regexHostBare, `${id}$1`);
  parsed = parsed.replace(regexHostContext, `$1 ${id}`);
  parsed = parsed.replace(regexHostSelector, `${id}$1`);

  return (cache[id][css] = parsed);
}

export default function css(str) {
  return function({ constructor }) {
    return native ? str : parse(getName(constructor), str);
  };
}
