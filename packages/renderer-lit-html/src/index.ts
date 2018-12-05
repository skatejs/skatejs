import { CustomElement } from '@skatejs/core';
import { render } from 'lit-html';

export default function(elem: CustomElement) {
  render(elem.render(), elem.renderRoot);
}
