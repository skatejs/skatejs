import diffMain from './diff/main';
import root from './util/root';

// const { Node } = root;

// function diffWorker(src, tar, { done }) {
//   const worker = new Worker('./worker.js');
//   worker.addEventListener('message', e => done(e.data));
//   worker.postMessage([src, tar]);
// }

// export default function diff(src, tar, { done } = {}) {
//   const canDiffInWorker = done && !(src instanceof Node && tar instanceof Node);
//   return canDiffInWorker
//     ? diffWorker(src, tar, { done })
//     : diffMain(src, tar, { done });
// }

export default diffMain;
