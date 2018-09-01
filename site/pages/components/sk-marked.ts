import { render } from '../../utils/md';
import { readFileSync } from 'fs';
export default render(
  'sk-marked',
  readFileSync(
    __dirname + '/../../node_modules/@skatejs/sk-marked/README.md'
  ).toString()
);
