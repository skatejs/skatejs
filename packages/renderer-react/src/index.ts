import { render } from 'react-dom';
import { Root } from '@skatejs/core';

export default function(root: Root, func: () => Object) {
  render(func(), root);
}
