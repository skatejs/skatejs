'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.link = link;

function getValue(elem) {
  const checked = elem.checked,
    type = elem.type,
    value = elem.value;

  if (type === 'checkbox' || type === 'radio') {
    return checked ? value || true : false;
  }
  return value;
}

function link(elem, target = 'state.') {
  return e => {
    // TODO revisit once all browsers have native support.
    //
    // We fallback to checking the composed path. Unfortunately this behaviour
    // is difficult to impossible to reproduce as it seems to be a possible
    // quirk in the shadydom polyfill that incorrectly returns null for the
    const localTarget = e.target || (e.composedPath && e.composedPath()[0]);
    const value = getValue(localTarget);
    const localTargetName = target || localTarget.name || 'value';

    if (localTargetName.indexOf('.') > -1) {
      const parts = localTargetName.split('.');
      const firstPart = parts[0];
      const propName = parts.pop();
      const obj = parts.reduce((prev, curr) => prev[curr], elem);

      obj[propName || localTarget.name] = value;
      elem[firstPart] = elem[firstPart];
    } else {
      elem[localTargetName] = value;
    }
  };
}
