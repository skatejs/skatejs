import { define } from '../../src/index';

let componentCount = 0;

export default function component (opts) {
  return define(`my-el-${++componentCount}`, opts);
}
