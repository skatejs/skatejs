import { readFileSync } from 'fs';
import { md } from '../../utils';

export default md(
  readFileSync(__dirname + '/../../../packages/sk-router/README.md').toString()
);
