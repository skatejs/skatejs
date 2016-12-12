import props from './props';

function getValue (elem) {
  const type = elem.type;
  if (type === 'checkbox' || type === 'radio') {
    return elem.checked ? elem.value || true : false;
  }
  return elem.value;
}

export default function (elem, target) {
  return (e) => {
    // We fallback to checking the composed path. Unfortunately this behaviour
    // is difficult to impossible to reproduce as it seems to be a possible
    // quirk in the shadydom polyfill that incorrectly returns null for the
    // target but has the target as the first point in the path.
    // TODO revisit once all browsers have native support.
    const localTarget = e.target || e.composedPath()[0];
    const value = getValue(localTarget);
    const localTargetName = target || localTarget.name || 'value';

    if (localTargetName.indexOf('.') > -1) {
      const parts = localTargetName.split('.');
      const firstPart = parts[0];
      const propName = parts.pop();
      const obj = parts.reduce((prev, curr) => (prev && prev[curr]), elem);

      obj[propName || e.target.name] = value;
      props(elem, {
        [firstPart]: elem[firstPart]
      });
    } else {
      props(elem, {
        [localTargetName]: value
      });
    }
  };
}
