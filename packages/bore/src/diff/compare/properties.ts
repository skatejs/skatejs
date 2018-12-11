import { SET_PROPERTY } from '../types';

export default function (src, tar) {
  const { properties: srcValues } = src;
  const { properties: tarValues } = tar;
  const instructions = [];

  for (let name in srcValues) {
    const srcValue = srcValues[name];
    const tarValue = tarValues[name];
    if (srcValue !== tarValue) {
      instructions.push({
        data: { name },
        target: tar,
        source: src,
        type: SET_PROPERTY
      });
    }
  }

  for (let name in tarValues) {
    const srcValue = srcValues[name];
    const tarValue = tarValues[name];
    if (srcValue !== tarValue) {
      instructions.push({
        data: { name },
        target: tar,
        source: src,
        type: SET_PROPERTY
      });
    }
  }

  return instructions;
}
