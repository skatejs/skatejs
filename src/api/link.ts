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
    const value = getValue(e.target);
    const localTarget = target || e.target.name || 'value';

    if (localTarget.indexOf('.') > -1) {
      const parts = localTarget.split('.');
      const firstPart = parts[0];
      const propName = parts.pop();
      const obj = parts.reduce((prev, curr) => (prev && prev[curr]), elem);

      obj[propName || e.target.name] = value;
      props(elem, {
        [firstPart]: elem[firstPart]
      });
    } else {
      props(elem, {
        [localTarget]: value
      });
    }
  };
}
