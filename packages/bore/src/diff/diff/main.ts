import * as types from '../types';
import compareNode from '../compare/node';

function diffNode (source, target) {
  let nodeInstructions = compareNode(source, target);

  // If there are instructions (even an empty array) it means the node can be
  // diffed and doesn't have to be replaced. If the instructions are falsy
  // it means that the nodes are not similar (cannot be changed) and must be
  // replaced instead.
  if (nodeInstructions) {
    return nodeInstructions.concat(diff(source, target));
  }

  return [{
    target,
    source,
    type: types.REPLACE_CHILD
  }];
}

export default function diff (src, tar) {
  let instructions = [];

  const srcChs = src.childNodes;
  const tarChs = tar.childNodes;
  const srcChsLen = srcChs ? srcChs.length : 0;
  const tarChsLen = tarChs ? tarChs.length : 0;

  for (let a = 0; a < tarChsLen; a++) {
    const curSrc = srcChs[a];
    const curtar = tarChs[a];

    // If there is no matching target node it means we need to remove the
    // current source node from the source.
    if (!curSrc) {
      instructions.push({
        target: tarChs[a],
        source: src,
        type: types.APPEND_CHILD
      });
      continue;
    }

    instructions = instructions.concat(diffNode(curSrc, curtar));
  }

  if (tarChsLen < srcChsLen) {
    for (let a = tarChsLen; a < srcChsLen; a++) {
      instructions.push({
        target: srcChs[a],
        source: src,
        type: types.REMOVE_CHILD
      });
    }
  }

  return instructions;
}
