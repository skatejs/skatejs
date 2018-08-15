import { render } from 'lit-html';

export default function(root, func) {
  render(func(), root);
}
