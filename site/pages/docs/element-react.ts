import { readFileSync } from 'fs';
import { md } from '../../utils';

export default md(
  readFileSync(
    __dirname + '/../../../packages/element-react/README.md'
  ).toString()
);
