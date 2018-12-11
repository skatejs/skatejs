import { REMOVE_ATTRIBUTE, SET_ATTRIBUTE } from '../types';

const empty = v => v == null;

export default function (src, tar) {
  const { attributes: srcValues } = src;
  const { attributes: tarValues } = tar;
  const instructions = [];

  for (let name in srcValues) {
    if (empty(tarValues[name])) {
      instructions.push({
        data: { name },
        target: tar,
        source: src,
        type: REMOVE_ATTRIBUTE
      });
    }
  }

  for (let name in tarValues) {
    const srcValue = srcValues[name];
    const tarValue = tarValues[name];

    // Only add attributes that have changed.
    if (srcValue !== tarValue && !empty(tarValues[name])) {
      instructions.push({
        data: { name },
        target: tar,
        source: src,
        type: SET_ATTRIBUTE
      });
    }
  }

  return instructions;
}
