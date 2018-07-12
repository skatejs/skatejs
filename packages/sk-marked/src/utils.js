export function format(src) {
  src = src.replace(/"/g, '&quot;');

  // Remove leading newlines.
  let lines = src.split('\n');

  // Get baseline indentation so we can remove it from all lines.
  let lineIndent;
  let baseIndent;
  for (let i = 0; i < lines.length; i++) {
    lineIndent = lines[i].match(/^\s+/);
    if (!lineIndent) {
      baseIndent = 0;
      break;
    }
    baseIndent = Math.min(
      baseIndent || lineIndent[0].length,
      lineIndent[0].length
    );
  }

  // Format indentation if necessary
  if (baseIndent) {
    lines = lines.map(s => s.substring(baseIndent));
  }

  // Re-instate newline formatting.
  return lines.join('\n');
}
