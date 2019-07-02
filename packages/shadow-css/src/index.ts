let scope = 0;

function parseValue(v) {
  if (typeof v === "number") {
    return `${v}px`;
  }
  if (Array.isArray(v)) {
    return v.map(parseValue).join(" ");
  }
  return v;
}

export default function(strings, ...parts) {
  let parsed = "";
  let classNames = {};

  parts.forEach((p, i) => {
    if (p[0] === ".") {
      const cn = p.substring(1);
      const cnScoped = `${cn}-${scope}`;
      classNames[cn] = cnScoped;
      parsed += `${strings[i]}.${cnScoped}`;
    } else {
      parsed += strings[i] + parseValue(p);
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
