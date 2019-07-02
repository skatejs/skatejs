export function outdent(strings, ...replacements) {
  if (typeof strings === "string") {
    strings = [strings];
  }

  let src =
    strings.map((s, i) => s + (replacements[i] || "")) +
    (replacements.pop() || "");

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
