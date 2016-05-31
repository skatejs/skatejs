import skate from '../../src/index';

let componentCount = 0;

export default function component (opts) {
  return skate(`my-el-${++componentCount}`, opts);
}
