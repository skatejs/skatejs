import { render } from '../../utils/md';
import { readFileSync } from 'fs';
export default render(
  'sk-context',
  readFileSync(
    __dirname + '/../../node_modules/@skatejs/sk-context/README.md'
  ).toString()
);
