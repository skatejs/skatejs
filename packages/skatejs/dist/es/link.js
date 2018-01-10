function getValue(elem) {
  var checked = elem.checked,
    type = elem.type,
    value = elem.value;

  if (type === 'checkbox' || type === 'radio') {
    return checked ? value || true : false;
  }
  return value;
}

export function link(elem) {
  var target =
    arguments.length > 1 && arguments[1] !== undefined
      ? arguments[1]
      : 'state.';

  return function(e) {
    // TODO revisit once all browsers have native support.
    //
    // We fallback to checking the composed path. Unfortunately this behaviour
    // is difficult to impossible to reproduce as it seems to be a possible
    // quirk in the shadydom polyfill that incorrectly returns null for the
    var localTarget = e.target || (e.composedPath && e.composedPath()[0]);
    var value = getValue(localTarget);
    var localTargetName = target || localTarget.name || 'value';

    if (localTargetName.indexOf('.') > -1) {
      var parts = localTargetName.split('.');
      var firstPart = parts[0];
      var propName = parts.pop();
      var obj = parts.reduce(function(prev, curr) {
        return prev[curr];
      }, elem);

      obj[propName || localTarget.name] = value;
      elem[firstPart] = elem[firstPart];
    } else {
      elem[localTargetName] = value;
    }
  };
}
