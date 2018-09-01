import { render } from '../../utils/md';
import { readFileSync } from 'fs';
export default render(
  'sk-router',
  readFileSync(
    __dirname + '/../../node_modules/@skatejs/sk-router/README.md'
  ).toString()
);
