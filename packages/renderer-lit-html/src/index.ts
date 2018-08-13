import { render } from 'lit-html/lib/lit-extended';

export default function(root, func) {
  render(func(), root);
}
