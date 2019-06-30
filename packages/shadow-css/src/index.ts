const native =
  typeof customElements !== "undefined" &&
  customElements.define.toString().indexOf("native code") > -1;

let scope = 0;
export default function(strings, ...parts) {
  let parsed = "";
  let classNames = {};

  parts.forEach((p, i) => {
    if (p[0] === ".") {
      const cn = p.substring(1);
      const cnScoped = native ? cn : `${cn}-${scope}`;
      classNames[cn] = cnScoped;
      parsed += `${strings[i]}.${cnScoped}`;
    } else {
      parsed += strings[i] + p;
    }
  });
  parsed += strings[strings.length - 1];

  ++scope;

  return {
    ...classNames,
    toString() {
      return parsed;
    }
  };
}
