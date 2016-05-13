import skate from '../../src/api/skate';

let componentCount = 0;

export default function component (opts) {
  return skate(`my-el-${++componentCount}`, opts);
}
