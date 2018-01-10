import { dashCase } from './util';

function format(prefix, suffix) {
  return (
    (prefix.indexOf('-') === -1 ? 'x-' + prefix : prefix) +
    (suffix ? '-' + suffix : '')
  );
}

export function name() {
  var prefix =
    arguments.length > 0 && arguments[0] !== undefined
      ? arguments[0]
      : 'element';

  prefix = dashCase(prefix);
  var suffix = 0;
  while (customElements.get(format(prefix, suffix))) {
    ++suffix;
  }
  return format(prefix, suffix);
}
