import nodeMap from '../util/node-map';

const propToAttrMap = {
  className: 'class'
};

export default function (src, tar, data) {
  const { name } = data;
  const node = nodeMap[src.__id];
  const prop = tar.properties[name];
  const mapped = propToAttrMap[name];

  if (mapped) {
    if (prop == null) {
      node.removeAttribute(mapped);
    } else {
      node.className = prop;
    }
  } else if (name === 'style') {
    const { style } = node;
    // Clear so we don't have to diff.
    style.cssText = '';

    // Handle both strings and objects.
    if (typeof prop === 'string') {
      style.cssText = prop;
    } else {
      for (let name in prop) {
        if (prop.hasOwnProperty(name)) {
          style[name] = prop[name];
        }
      }
    }
  } else {
    node[name] = prop;
  }
}
