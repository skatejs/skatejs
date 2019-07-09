type Value = number | string;
type ValueArr = Array<Value>;
type ValueFn = () => Value | ValueArr;

const scopes = {};

function hash(str: string) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const chr = str.charCodeAt(i);
    hash = (hash << 5) - hash + chr;
    hash |= 0;
  }
  return hash;
}

function parseValue(v: Value | ValueArr | ValueFn): string {
  if (typeof v === "function") {
    return parseValue(v());
  }
  if (typeof v === "number") {
    return `${v}px`;
  }
  if (Array.isArray(v)) {
    return v.map(parseValue).join(" ");
  }
  return v;
}

export default function(
  strings: TemplateStringsArray,
  ...parts: Array<any>
): {
  [className: string]: string;
  css: string;
} {
  const key = String.raw(strings, ...parts);
  const scope = scopes[key] || (scopes[key] = hash(key));
  const classNames = { css: "" };
  classNames.css =
    parts.reduce((parsed, part, i) => {
      if (part[0] === ".") {
        const cn = part.substring(1);
        const cnScoped = `${cn}-${scope}`;
        classNames[cn] = cnScoped;
        return parsed + `${strings[i]}.${cnScoped}`;
      } else {
        return parsed + strings[i] + parseValue(part);
      }
    }, "") + strings[strings.length - 1];
  classNames.toString = () => JSON.stringify(classNames);
  return classNames;
}

export function cx(...classNames) {
  return classNames.filter(Boolean).join(" ");
}
